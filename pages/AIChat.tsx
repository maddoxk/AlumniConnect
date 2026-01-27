
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Search, Briefcase, MapPin, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAlumni, saveChatState, getChatState, clearChatState } from '../services/db';
import { findAlumniMatches } from '../services/gemini';
import { ChatMessage, AlumniProfile } from '../types';

const AIChat = () => {
  const chatState = useMemo(() => getChatState(), []);
  
  const [input, setInput] = useState(chatState?.input || '');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(chatState?.messages || [
    {
      role: 'assistant',
      content: "Hi! I'm your Alumni Intelligence assistant. I can help you identify high-value connections, potential mentors, or subject matter experts within your network.\n\nTry asking:\n• \"Who has experience in AI or Machine Learning in Colorado?\"\n• \"Suggest 3 alumni in the Entertainment industry for a guest speaker panel.\"\n• \"Find me recent graduates working at Google or Disney.\"",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const alumniList = useMemo(() => getAlumni(), []);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persist state whenever messages or input change
  useEffect(() => {
    saveChatState(messages, input);
  }, [messages, input]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await findAlumniMatches(input, alumniList);

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: result.answer,
      suggestedAlumniIds: result.suggestedIds,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleClearChat = () => {
    if (confirm('Clear entire chat history?')) {
      clearChatState();
      setMessages([
        {
          role: 'assistant',
          content: "Chat cleared. How can I help you today?",
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
        className="block bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all mt-2 group border-l-4 border-l-indigo-500"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0 border border-indigo-100">
            {alum.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate text-sm">{alum.name}</h4>
            <div className="flex items-center text-[10px] text-slate-500 space-x-2 mt-0.5">
              <span className="flex items-center font-semibold"><Briefcase size={10} className="mr-1 text-indigo-400" /> {alum.company !== '-' ? alum.company : 'Independent'}</span>
              <span className="flex items-center"><MapPin size={10} className="mr-1 text-slate-400" /> {alum.location}</span>
            </div>
          </div>
          <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
           <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
             <Sparkles size={20} />
           </div>
           <div>
             <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Network Scout</h1>
             <p className="text-slate-400 text-xs font-medium">Analyzing {alumniList.length} profiles for semantic matching</p>
           </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleClearChat}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model</p>
            <p className="text-xs font-bold text-indigo-600">Gemini 3 Flash</p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-inner overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3 space-x-reverse`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-indigo-600 border border-slate-200'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="flex flex-col">
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.suggestedAlumniIds && msg.suggestedAlumniIds.length > 0 && (
                    <div className={`mt-4 pt-4 border-t ${msg.role === 'user' ? 'border-white/10' : 'border-slate-100'}`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <Search size={12} className="text-indigo-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Matches</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.suggestedAlumniIds.map(id => (
                          <MatchCard key={id} id={id} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className={`text-[10px] mt-1.5 font-bold text-slate-400 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot size={18} />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Analyzing Directory...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-2">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute inset-0 bg-indigo-600/5 rounded-2xl blur-lg group-focus-within:bg-indigo-600/10 transition-all"></div>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the type of alumnus you're looking for..."
            className="relative w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-6 pr-16 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 shadow-lg shadow-slate-200/50 font-medium text-slate-900 transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Privacy Mode Active</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Real-time Directory Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
