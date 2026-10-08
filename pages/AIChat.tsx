import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, Sparkles, User, Bot, Loader2, Search, 
  Briefcase, MapPin, ArrowRight, Trash2, CheckCircle2,
  GraduationCap, ChevronRight, CornerDownLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAlumni, saveChatState, getChatState, clearChatState } from '../services/db';
import { findAlumniMatches } from '../services/gemini';
import { ChatMessage, AlumniProfile } from '../types';

const PROMPT_STARTERS = [
  "Find alumni with AI or machine learning experience in Colorado",
  "Identify finance leaders in New York for an upcoming student career trek",
  "Suggest recent graduates at Disney, Google, or Caterpillar for a panel",
  "Healthcare, biochemistry, or clinical research alumni for student mentorship"
];

const AIChat = () => {
  const chatState = useMemo(() => getChatState(), []);
  
  const [input, setInput] = useState(chatState?.input || '');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(chatState?.messages || [
    {
      role: 'assistant',
      content: "Welcome to the Advancement Discovery Copilot. I can cross-reference the active database of 349 University of Denver alumni profiles to match mentors, keynote speakers, or regional contacts based on industry, company, and academic degree.\n\nSelect a preset prompt below or type your inquiry:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const alumniList = useMemo(() => getAlumni(), []);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveChatState(messages, input);
  }, [messages, input]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await findAlumniMatches(queryText, alumniList);

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: result.answer,
      suggestedAlumniIds: result.suggestedIds,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuery(input);
  };

  const handleClearChat = () => {
    if (confirm('Clear discovery session conversation?')) {
      clearChatState();
      setMessages([
        {
          role: 'assistant',
          content: "Conversation cleared. How can I assist with your alumni research today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setInput('');
    }
  };

  const MatchCard = ({ id }: { id: string; key?: React.Key }) => {
    const alum = alumniList.find(a => a.id === id);
    if (!alum) return null;

    return (
      <Link 
        to={`/alumni/${alum.id}`}
        className="block p-3.5 bg-white border border-slate-200/90 rounded-lg hover:border-slate-300 hover:shadow-xs transition-all group"
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="badge-neutral text-[10px]">
                Class of {alum.gradYear}
              </span>
              <span className="text-[10px] text-slate-400 truncate">{alum.location}</span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-[#BA0C2F] transition-colors truncate text-xs">
              {alum.name}
            </h4>
            <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
              {alum.company}
            </p>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {alum.headline}
            </p>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2 mt-1" />
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto space-y-3">
      {/* Copilot Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Advancement Discovery Copilot</h1>
            <p className="text-slate-500 text-xs">Semantic search & matching engine • {alumniList.length} alumni indexed</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="badge-neutral text-[10px] hidden sm:inline-flex">
            Model: Gemini 3 Flash
          </span>
          <button 
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            title="Clear Chat History"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Message Feed Container */}
      <div 
        ref={scrollRef}
        className="flex-1 card-institutional overflow-y-auto p-4 md:p-6 space-y-5"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3 space-x-reverse`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-rose-50 text-[#BA0C2F] border border-rose-200/60'
              }`}>
                {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
              </div>

              <div className="flex flex-col">
                <div className={`p-4 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Structured Match Cards if present */}
                  {msg.suggestedAlumniIds && msg.suggestedAlumniIds.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-slate-200">
                      <div className="flex items-center space-x-1.5 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        <Search size={12} className="text-[#BA0C2F]" />
                        <span>Recommended Pioneer Contacts ({msg.suggestedAlumniIds.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {msg.suggestedAlumniIds.map(id => (
                          <MatchCard key={id} id={id} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className={`text-[10px] text-slate-400 mt-1 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#BA0C2F] border border-rose-200/60 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={15} />
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center space-x-2.5 text-xs text-slate-600">
                <Loader2 className="animate-spin text-slate-500" size={14} />
                <span>Analyzing alumni database for semantic matches...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick-Start Presets */}
      {messages.length <= 2 && !isLoading && (
        <div className="space-y-1.5 px-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Suggested queries:</span>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_STARTERS.map((starter) => (
              <button 
                key={starter}
                onClick={() => handleQuery(starter)}
                className="text-left text-[11px] px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Query Input Bar */}
      <div className="pt-1">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search alumni by industry, role, location, or mentorship topic..."
            className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-4 pr-24 focus:outline-none focus:border-slate-500 text-xs text-slate-900 placeholder:text-slate-400 shadow-xs"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1.5">
            <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">↵ return</span>
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Submit Query"
            >
              <CornerDownLeft size={14} />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 mt-2">
          <span>Official University of Denver Advancement Network</span>
          <span>Queries processed locally with Gemini GenAI</span>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
