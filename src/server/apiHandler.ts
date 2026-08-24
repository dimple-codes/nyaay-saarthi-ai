import type { Request, Response } from 'express';
import { 
  streamChatResponse, 
  generateChatResponse,
  generateLegalGuidance, 
  summarizeLegalDiscussion, 
  generateFollowUpSuggestions,
  getModelConfig
} from './geminiService.ts';
import { 
  checkEmergencyGuardrails, 
  sanitizeUserInput, 
  logFlaggedInteraction 
} from './safetyGuardrails.ts';
import { ConversationStore } from './conversationStore.ts';
import { ChatMessage } from '../types.ts';

/**
 * Streaming Chat Endpoint (Server-Sent Events)
 * POST /api/chat/stream
 */
export async function handleChatStream(req: Request, res: Response) {
  try {
    const { message, history = [], language = 'en', citizenContext, conversationId, userId = 'anonymous' } = req.body || {};

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required and must be a string' });
      return;
    }

    const sanitizedMessage = sanitizeUserInput(message);
    const emergencyCheck = checkEmergencyGuardrails(sanitizedMessage);

    if (emergencyCheck.isEmergency) {
      logFlaggedInteraction({
        userId,
        category: emergencyCheck.category,
        timestamp: new Date().toISOString(),
        triggerType: emergencyCheck.triggerKeywords.join(', ')
      });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Send initial emergency status metadata event
    res.write(`event: metadata\ndata: ${JSON.stringify({
      emergency: emergencyCheck.isEmergency,
      category: emergencyCheck.category,
      helplines: emergencyCheck.helplines,
      alertBanner: language === 'hi' ? emergencyCheck.alertBannerMessageHi : emergencyCheck.alertBannerMessage,
      model: getModelConfig().model
    })}\n\n`);

    let fullAccumulatedText = '';

    await streamChatResponse(
      {
        message: sanitizedMessage,
        history,
        language: language === 'hi' ? 'hi' : 'en',
        citizenContext
      },
      (chunkText) => {
        fullAccumulatedText += chunkText;
        res.write(`event: chunk\ndata: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    );

    // Record user and assistant messages in conversation store if conversationId is provided
    if (conversationId) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const userMsg: ChatMessage = {
        id: `msg_u_${Date.now()}`,
        sender: 'user',
        text: sanitizedMessage,
        timestamp
      };
      
      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: fullAccumulatedText,
        timestamp,
        isAiGenerated: true,
        flaggedEmergency: emergencyCheck.isEmergency,
        emergencyHelplines: emergencyCheck.isEmergency ? emergencyCheck.helplines : undefined,
        emergencyCategory: emergencyCheck.category
      };

      ConversationStore.appendMessageToConversation(conversationId, userId, userMsg);
      ConversationStore.appendMessageToConversation(conversationId, userId, assistantMsg);
    }

    res.write(`event: done\ndata: ${JSON.stringify({ done: true, fullText: fullAccumulatedText })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error in /api/chat/stream:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to stream response from Gemini',
        details: error?.message || 'Internal server error'
      });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: error?.message || 'Streaming failed' })}\n\n`);
      res.end();
    }
  }
}

/**
 * Standard Non-Streaming Chat Endpoint
 * POST /api/chat/message
 */
export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, history = [], language = 'en', citizenContext, conversationId, userId = 'anonymous' } = req.body || {};

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required and must be a string' });
      return;
    }

    const sanitizedMessage = sanitizeUserInput(message);
    const emergencyCheck = checkEmergencyGuardrails(sanitizedMessage);

    if (emergencyCheck.isEmergency) {
      logFlaggedInteraction({
        userId,
        category: emergencyCheck.category,
        timestamp: new Date().toISOString(),
        triggerType: emergencyCheck.triggerKeywords.join(', ')
      });
    }

    const response = await generateChatResponse({
      message: sanitizedMessage,
      history,
      language: language === 'hi' ? 'hi' : 'en',
      citizenContext
    });

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const messageRecord: ChatMessage = {
      id: `msg_a_${Date.now()}`,
      sender: 'assistant',
      text: response.text,
      timestamp,
      isAiGenerated: true,
      flaggedEmergency: emergencyCheck.isEmergency,
      emergencyHelplines: emergencyCheck.isEmergency ? emergencyCheck.helplines : undefined,
      emergencyCategory: emergencyCheck.category
    };

    if (conversationId) {
      const userMsg: ChatMessage = {
        id: `msg_u_${Date.now()}`,
        sender: 'user',
        text: sanitizedMessage,
        timestamp
      };
      ConversationStore.appendMessageToConversation(conversationId, userId, userMsg);
      ConversationStore.appendMessageToConversation(conversationId, userId, messageRecord);
    }

    res.json({
      message: messageRecord,
      emergency: {
        isEmergency: emergencyCheck.isEmergency,
        category: emergencyCheck.category,
        helplines: emergencyCheck.helplines,
        alertBanner: language === 'hi' ? emergencyCheck.alertBannerMessageHi : emergencyCheck.alertBannerMessage
      },
      model: getModelConfig().model
    });
  } catch (error: any) {
    console.error('Error handling /api/chat/message:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      details: error?.message || 'Internal server error'
    });
  }
}

/**
 * Rich AI Guidance with statutory extraction & draft notice
 * POST /api/ai/chat
 */
export async function handleAiChat(req: Request, res: Response) {
  try {
    const { message, history, language, citizenContext, conversationId, userId = 'anonymous' } = req.body || {};
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required and must be a string' });
      return;
    }

    const sanitizedMessage = sanitizeUserInput(message);
    const emergencyCheck = checkEmergencyGuardrails(sanitizedMessage);

    if (emergencyCheck.isEmergency) {
      logFlaggedInteraction({
        userId,
        category: emergencyCheck.category,
        timestamp: new Date().toISOString(),
        triggerType: emergencyCheck.triggerKeywords.join(', ')
      });
    }

    const result = await generateLegalGuidance({
      message: sanitizedMessage,
      history,
      language: language === 'hi' ? 'hi' : 'en',
      citizenContext
    });

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (conversationId) {
      const userMsg: ChatMessage = {
        id: `msg_u_${Date.now()}`,
        sender: 'user',
        text: sanitizedMessage,
        timestamp
      };

      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: result.text,
        timestamp,
        isAiGenerated: true,
        flaggedEmergency: emergencyCheck.isEmergency,
        emergencyHelplines: emergencyCheck.isEmergency ? emergencyCheck.helplines : undefined,
        emergencyCategory: emergencyCheck.category,
        structuredData: {
          understanding: result.understanding,
          rights: result.rights,
          legalArea: result.legalArea,
          isActionable: result.isActionable,
          authority: result.authority,
          documents: result.documents,
          nextSteps: result.nextSteps,
          legalAid: result.legalAid,
          recommendedCategory: result.recommendedCategory,
          suggestedAdvocateSpecialty: result.suggestedAdvocateSpecialty,
          draftTitle: result.draftTitle,
          draftBody: result.draftBody
        },
        summary: result.summary,
        suggestions: result.suggestions
      };

      ConversationStore.appendMessageToConversation(conversationId, userId, userMsg);
      ConversationStore.appendMessageToConversation(conversationId, userId, assistantMsg);
    }

    res.json({
      ...result,
      emergency: {
        isEmergency: emergencyCheck.isEmergency,
        category: emergencyCheck.category,
        helplines: emergencyCheck.helplines,
        alertBanner: language === 'hi' ? emergencyCheck.alertBannerMessageHi : emergencyCheck.alertBannerMessage
      },
      model: getModelConfig().model
    });
  } catch (error: any) {
    console.error('Error handling /api/ai/chat:', error);
    res.status(500).json({ 
      error: 'Failed to generate legal guidance',
      details: error?.message || 'Internal server error'
    });
  }
}

/**
 * Emergency Check endpoint
 * POST /api/chat/emergency-check
 */
export async function handleEmergencyCheck(req: Request, res: Response) {
  try {
    const { text, language = 'en' } = req.body || {};
    const check = checkEmergencyGuardrails(text || '');
    res.json({
      isEmergency: check.isEmergency,
      category: check.category,
      helplines: check.helplines,
      alertBanner: language === 'hi' ? check.alertBannerMessageHi : check.alertBannerMessage
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Emergency check failed' });
  }
}

/**
 * List Conversations for user
 * GET /api/chat/conversations
 */
export async function handleGetConversations(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string) || 'default';
    const conversations = ConversationStore.getConversationsForUser(userId);
    res.json({ conversations });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
}

/**
 * Get Conversation By ID
 * GET /api/chat/conversations/:id
 */
export async function handleGetConversationById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
    const session = ConversationStore.getConversationById(id, userId);
    if (!session) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    res.json({ conversation: session });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
}

/**
 * Save Conversation
 * POST /api/chat/conversations
 */
export async function handleSaveConversation(req: Request, res: Response) {
  try {
    const session = req.body;
    if (!session || !session.id) {
      res.status(400).json({ error: 'Invalid conversation data' });
      return;
    }
    const saved = ConversationStore.createOrUpdateConversation(session);
    res.json({ conversation: saved });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save conversation' });
  }
}

/**
 * Delete Conversation
 * DELETE /api/chat/conversations/:id
 */
export async function handleDeleteConversation(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
    const success = ConversationStore.deleteConversation(id, userId);
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
}

/**
 * Case Summarization Endpoint
 * POST /api/ai/summarize
 */
export async function handleAiSummarize(req: Request, res: Response) {
  try {
    const { text, messages, language } = req.body || {};

    const result = await summarizeLegalDiscussion({
      text,
      messages,
      language: language === 'hi' ? 'hi' : 'en'
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error handling /api/ai/summarize:', error);
    res.status(500).json({ 
      error: 'Failed to summarize legal consultation',
      details: error?.message || 'Internal server error'
    });
  }
}

/**
 * Dynamic Follow-up Suggestions Endpoint
 * POST /api/ai/suggestions
 */
export async function handleAiSuggestions(req: Request, res: Response) {
  try {
    const { message, context, language } = req.body || {};

    if (!message) {
      res.status(400).json({ error: 'Message or inquiry context is required' });
      return;
    }

    const suggestions = await generateFollowUpSuggestions({
      message,
      context,
      language: language === 'hi' ? 'hi' : 'en'
    });

    res.json({ suggestions });
  } catch (error: any) {
    console.error('Error handling /api/ai/suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggestions',
      details: error?.message || 'Internal server error'
    });
  }
}
