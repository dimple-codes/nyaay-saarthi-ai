import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { 
  handleChatMessage,
  handleChatStream,
  handleAiChat, 
  handleAiSummarize, 
  handleAiSuggestions,
  handleEmergencyCheck,
  handleGetConversations,
  handleGetConversationById,
  handleSaveConversation,
  handleDeleteConversation
} from './src/server/apiHandler.ts';
import { rateLimiterMiddleware } from './src/server/rateLimiter.ts';
import { getModelConfig } from './src/server/geminiService.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Apply rate limiting to all AI / Chat endpoints
  app.use('/api/chat', rateLimiterMiddleware);
  app.use('/api/ai', rateLimiterMiddleware);

  // Dedicated Chat & Streaming Endpoints
  app.post('/api/chat/stream', handleChatStream);
  app.post('/api/chat/message', handleChatMessage);
  app.post('/api/chat/emergency-check', handleEmergencyCheck);

  // Conversation Sessions & History Endpoints
  app.get('/api/chat/conversations', handleGetConversations);
  app.get('/api/chat/conversations/:id', handleGetConversationById);
  app.post('/api/chat/conversations', handleSaveConversation);
  app.delete('/api/chat/conversations/:id', handleDeleteConversation);

  // Rich AI & Analysis Endpoints
  app.post('/api/ai/chat', handleAiChat);
  app.post('/api/ai/summarize', handleAiSummarize);
  app.post('/api/ai/suggestions', handleAiSuggestions);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const config = getModelConfig();
    res.json({ 
      status: 'ok', 
      time: new Date().toISOString(),
      model: config.model,
      temperature: config.temperature,
      hasKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Vite middleware for development vs static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

