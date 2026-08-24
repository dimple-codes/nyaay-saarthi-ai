import { ChatMessage, Language, AuthUser, AiCaseSummary, ChatSession, EmergencyHelpline } from '../types';
import { analyzeAndGenerateLegalGuidance } from '../data/portalData';

export interface SendMessageParams {
  message: string;
  history?: ChatMessage[];
  language?: Language;
  user?: AuthUser | null;
  conversationId?: string;
}

export interface StreamChatParams extends SendMessageParams {
  onMetadata?: (meta: { emergency: boolean; category?: string; helplines: EmergencyHelpline[]; alertBanner?: string; model?: string }) => void;
  onChunk: (chunk: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (err: Error) => void;
}

/**
 * Stream conversational message from backend with SSE
 */
export async function streamChatMessage(params: StreamChatParams): Promise<string> {
  const { message, history = [], language = 'en', user, conversationId, onMetadata, onChunk, onComplete, onError } = params;

  const conversationHistory = history.map(h => ({
    sender: h.sender,
    text: h.text
  }));

  try {
    const res = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user?.id || 'anonymous_user'
      },
      body: JSON.stringify({
        message,
        history: conversationHistory,
        language,
        conversationId,
        userId: user?.id || 'anonymous_user',
        citizenContext: user ? {
          name: user.name,
          city: user.city,
          state: user.state
        } : undefined
      })
    });

    if (!res.ok) {
      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Rate limit reached. Please wait a moment before sending another query.');
      }
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }

    if (!res.body) {
      throw new Error('ReadableStream not supported by browser or response has no body');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      let currentEvent = 'message';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.substring(6).trim();
          continue;
        }

        if (trimmed.startsWith('data:')) {
          const rawData = trimmed.substring(5).trim();
          try {
            const data = JSON.parse(rawData);

            if (currentEvent === 'metadata' && onMetadata) {
              onMetadata(data);
            } else if (currentEvent === 'chunk' || data.text !== undefined) {
              if (data.text) {
                fullText += data.text;
                onChunk(data.text);
              }
            } else if (currentEvent === 'done') {
              if (data.fullText) fullText = data.fullText;
            } else if (currentEvent === 'error') {
              throw new Error(data.error || 'Stream error');
            }
          } catch (e: any) {
            // Ignore parse errors on partial frames
          }
        }
      }
    }

    if (onComplete) {
      onComplete(fullText);
    }
    return fullText;
  } catch (error: any) {
    console.error('streamChatMessage error:', error);
    if (onError) onError(error);
    throw error;
  }
}

/**
 * Standard Non-Streaming Message Endpoint
 */
export async function sendChatMessage(params: SendMessageParams): Promise<{ message: ChatMessage; emergency?: any }> {
  const { message, history = [], language = 'en', user, conversationId } = params;

  const conversationHistory = history.map(h => ({
    sender: h.sender,
    text: h.text
  }));

  const res = await fetch('/api/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': user?.id || 'anonymous_user'
    },
    body: JSON.stringify({
      message,
      history: conversationHistory,
      language,
      conversationId,
      userId: user?.id || 'anonymous_user',
      citizenContext: user ? {
        name: user.name,
        city: user.city,
        state: user.state
      } : undefined
    })
  });

  if (!res.ok) {
    if (res.status === 429) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Rate limit exceeded. Please wait a moment.');
    }
    throw new Error(`Server returned ${res.status}: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Deep Legal Guidance with statutory breakdown & notice generator
 */
export async function requestAiLegalGuidance(params: SendMessageParams): Promise<ChatMessage> {
  const { message, history = [], language = 'en', user, conversationId } = params;

  const conversationHistory = history.map(h => ({
    sender: h.sender,
    text: h.text
  }));

  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user?.id || 'anonymous_user'
      },
      body: JSON.stringify({
        message,
        history: conversationHistory,
        language,
        conversationId,
        userId: user?.id || 'anonymous_user',
        citizenContext: user ? {
          name: user.name,
          city: user.city,
          state: user.state
        } : undefined
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Rate limit exceeded.');
      }
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      id: 'msg_ai_' + Date.now(),
      sender: 'assistant',
      text: data.text,
      timestamp,
      isAiGenerated: true,
      flaggedEmergency: data.emergency?.isEmergency,
      emergencyHelplines: data.emergency?.helplines,
      emergencyCategory: data.emergency?.category,
      structuredData: {
        understanding: data.understanding,
        rights: data.rights || [],
        legalArea: data.legalArea,
        isActionable: data.isActionable,
        authority: data.authority,
        documents: data.documents || [],
        nextSteps: data.nextSteps || [],
        legalAid: data.legalAid,
        recommendedCategory: data.recommendedCategory,
        suggestedAdvocateSpecialty: data.suggestedAdvocateSpecialty,
        draftTitle: data.draftTitle,
        draftBody: data.draftBody,
      },
      summary: data.summary,
      suggestions: data.suggestions || []
    };
  } catch (error: any) {
    console.warn('Backend /api/ai/chat fallback:', error);
    // Fallback to local intelligent analysis
    const fallbackResponse = analyzeAndGenerateLegalGuidance(message, language);
    return {
      ...fallbackResponse,
      id: 'msg_ai_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAiGenerated: false,
      summary: {
        title: language === 'en' ? "Legal Case Summary & Action Brief" : "कानूनी सारांश व कार्य योजना",
        overview: fallbackResponse.structuredData?.understanding || "Legal matter assessment under statutory provisions.",
        keyPoints: fallbackResponse.structuredData?.rights || [
          "Preserve all transaction logs and documentary proof",
          "Issue statutory notice within the prescribed timeline"
        ],
        riskLevel: 'Medium',
        timelineUrgency: language === 'en' ? "Action advised within 15-30 days" : "15-30 दिनों के भीतर कार्रवाई",
        next48Hours: fallbackResponse.structuredData?.nextSteps?.slice(0, 3) || [
          "Collate all receipts and digital evidence",
          "Draft and send formal notice",
          "Consult a verified advocate"
        ],
        advocateBrief: `Citizen facing issue related to ${fallbackResponse.structuredData?.legalArea || 'dispute'}; seeking formal representation.`,
        estimatedRemedy: "Statutory compensation and resolution"
      },
      suggestions: language === 'en' ? [
        "What evidence do I need to keep ready?",
        "Can I file this complaint online?",
        "What are my rights if the opposite party ignores the notice?",
        "Connect me with a verified advocate"
      ] : [
        "मुझे कौन से सबूत तैयार रखने चाहिए?",
        "क्या मैं ऑनलाइन शिकायत दर्ज कर सकता हूँ?",
        "यदि विपक्षी नोटिस का उत्तर न दे तो क्या करें?",
        "मुझे संबंधित वकील से जोड़ें"
      ]
    };
  }
}

/**
 * Fetch Conversations List
 */
export async function fetchUserConversations(userId: string): Promise<ChatSession[]> {
  try {
    const res = await fetch(`/api/chat/conversations?userId=${encodeURIComponent(userId)}`, {
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to fetch conversations');
    const data = await res.json();
    return data.conversations || [];
  } catch (err) {
    console.warn('Local fallback for conversations:', err);
    try {
      const stored = localStorage.getItem(`nyay_sessions_${userId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  }
}

/**
 * Save Conversation Session
 */
export async function saveUserConversation(session: ChatSession, userId: string): Promise<void> {
  try {
    await fetch('/api/chat/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify(session)
    });
  } catch (err) {
    console.warn('Error saving to server, storing locally:', err);
  }

  // Also sync locally
  try {
    const key = `nyay_sessions_${userId}`;
    const raw = localStorage.getItem(key);
    const list: ChatSession[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex(s => s.id === session.id);
    if (index >= 0) {
      list[index] = session;
    } else {
      list.unshift(session);
    }
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {}
}

/**
 * Delete Conversation
 */
export async function deleteUserConversation(sessionId: string, userId: string): Promise<void> {
  try {
    await fetch(`/api/chat/conversations/${sessionId}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId }
    });
  } catch (err) {
    console.warn('Error deleting conversation on server:', err);
  }

  try {
    const key = `nyay_sessions_${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const list: ChatSession[] = JSON.parse(raw);
      const filtered = list.filter(s => s.id !== sessionId);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  } catch (e) {}
}

/**
 * Summarize Legal Discussion
 */
export async function requestAiCaseSummary(params: {
  text?: string;
  messages?: ChatMessage[];
  language?: Language;
}): Promise<AiCaseSummary> {
  const { text, messages = [], language = 'en' } = params;

  try {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        messages: messages.map(m => ({ sender: m.sender, text: m.text })),
        language
      })
    });

    if (!res.ok) throw new Error(`Summary API error: ${res.status}`);
    const data = await res.json();
    return data as AiCaseSummary;
  } catch (err) {
    console.warn('Summarize API fallback:', err);
    return {
      title: language === 'en' ? "Legal Consultation Executive Brief" : "कानूनी परामर्श सारांश",
      overview: language === 'en'
        ? "Summary of citizen's legal inquiry highlighting statutory rights, competent forums, and necessary evidentiary records."
        : "नागरिक के मामले का संक्षिप्त कानूनी विश्लेषण और आवश्यक कदम।",
      keyPoints: [
        language === 'en' ? "Statutory rights are available under codified Indian law" : "भारतीय कानून के तहत कानूनी अधिकार उपलब्ध हैं",
        language === 'en' ? "Written proof and timeline compliance are essential" : "लिखित साक्ष्य और समय सीमा का पालन आवश्यक है",
        language === 'en' ? "Formal notice provides statutory cause of action" : "वैधानिक नोटिस मुकदमे की औपचारिक शुरुआत है"
      ],
      riskLevel: "Medium",
      timelineUrgency: language === 'en' ? "Action required within 15-30 days" : "15-30 दिन में कार्रवाई आवश्यक",
      next48Hours: [
        language === 'en' ? "Collect all invoices, bank statements, and chat logs" : "सभी बिल, बैंक विवरण व चैट सुरक्षित करें",
        language === 'en' ? "Dispatch formal notice via registered post / email" : "पंजीकृत डाक / ईमेल द्वारा नोटिस भेजें",
        language === 'en' ? "Schedule consultation with verified counsel" : "अनुभवी वकील से अपॉइंटमेंट लें"
      ],
      advocateBrief: language === 'en'
        ? "Citizen requires legal representation and drafting assistance before the competent authority."
        : "नागरिक को संबंधित प्राधिकरण के समक्ष याचिका व नोटिस हेतु कानूनी परामर्श की आवश्यकता है।",
      estimatedRemedy: language === 'en' ? "Restitution of grievance, damages, and costs" : "नुकसान की भरपाई और उचित समाधान"
    };
  }
}

/**
 * Dynamic Suggestions
 */
export async function requestAiSuggestions(params: {
  message: string;
  context?: string;
  language?: Language;
}): Promise<string[]> {
  try {
    const res = await fetch('/api/ai/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error(`Suggestions API error: ${res.status}`);
    const data = await res.json();
    return data.suggestions || [];
  } catch (err) {
    console.warn('Suggestions API fallback:', err);
    return params.language === 'hi' ? [
      "मुझे कौन से कानूनी कदम उठाने चाहिए?",
      "क्या मैं मुफ्त कानूनी सहायता के योग्य हूँ?",
      "नोटिस का प्रारूप कैसे तैयार करें?"
    ] : [
      "What are the immediate legal remedies available?",
      "How do I preserve digital evidence?",
      "Can I resolve this through mediation?"
    ];
  }
}
