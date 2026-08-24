import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Clock, Search, X, ChevronRight, Sparkles } from 'lucide-react';
import { ChatSession, Language } from '../../types';

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  language: Language;
}

export function ChatHistoryDrawer({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  language
}: ChatHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.summary && s.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-start animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white/95 backdrop-blur-2xl h-full shadow-2xl border-r border-white/80 flex flex-col p-5 space-y-4 animate-in slide-in-from-left duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-100/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'en' ? 'Chat History' : 'बातचीत का इतिहास'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {sessions.length} {language === 'en' ? 'saved consultations' : 'सहेजी गई बातचीत'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewSession();
            onClose();
          }}
          className="glass-btn-primary py-2.5 px-4 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.25)] cursor-pointer active:scale-95 transition-all w-full"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'en' ? 'New Legal Inquiry' : 'नया कानूनी प्रश्न'}</span>
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search previous inquiries...' : 'पिछली बातचीत खोजें...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">
                {searchQuery
                  ? (language === 'en' ? 'No matching inquiries found' : 'कोई मेल नहीं मिला')
                  : (language === 'en' ? 'No past conversations yet' : 'कोई पिछली बातचीत नहीं')}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === currentSessionId;
              const formattedDate = new Date(session.updatedAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={session.id}
                  className={`group relative rounded-2xl p-3 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 border-sky-300 shadow-xs'
                      : 'bg-white/70 hover:bg-white border-slate-200/70 hover:border-sky-200'
                  }`}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className={`text-xs font-bold truncate ${isActive ? 'text-sky-950' : 'text-slate-800'}`}>
                        {session.title || (language === 'en' ? 'Legal Consultation' : 'कानूनी परामर्श')}
                      </h4>
                      {session.summary && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {session.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <span>{session.messages.length} msgs</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      title="Delete conversation"
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-500" />
          <span>Synced with Gemini Legal AI</span>
        </div>
      </div>
    </div>
  );
}
