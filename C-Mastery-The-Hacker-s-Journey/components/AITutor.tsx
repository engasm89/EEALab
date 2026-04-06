import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { askAITutor } from '../services/geminiService';

interface Props {
  currentTopic: string;
  lessonContext: string;
  triggerQuery?: string;
  onQueryReset?: () => void;
}

export default function AITutor({ currentTopic, lessonContext, triggerQuery, onQueryReset }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: "Greetings, Hacker. I am CyberMentor. Stuck on a segfault? Ask me anything about the current mission." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  // Keep ref in sync with state for async access
  useEffect(() => {
    messagesRef.current = messages;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle external triggers (e.g. "Explain Code" button)
  useEffect(() => {
    const handleTrigger = async () => {
      if (triggerQuery && !isLoading) {
        // Clear the trigger immediately to prevent loops
        if (onQueryReset) onQueryReset();
        
        await processQuery(triggerQuery);
      }
    };
    handleTrigger();
  }, [triggerQuery, onQueryReset, isLoading]);

  const processQuery = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', text: text };
    
    // Optimistically update UI
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Use ref to get current history without stale closure issues
    // We pass the history *before* this new message, or include it? 
    // The service expects previous history. The ref currently has history (including previous messages).
    // We haven't updated the ref with the NEW userMsg yet because state update is async.
    // So messagesRef.current is the history BEFORE the current question. perfect.
    const history = [...messagesRef.current]; 
    
    const aiResponse = await askAITutor(currentTopic, text, lessonContext, history);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const text = input;
    setInput('');
    await processQuery(text);
  };

  return (
    <div className="w-full lg:w-80 bg-slate-900 border border-slate-700 rounded-xl flex flex-col shadow-xl h-96 lg:h-auto">
      <div className="p-3 border-b border-slate-800 bg-slate-900 rounded-t-xl flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <h3 className="font-mono font-bold text-sm text-green-400">AI_TERMINAL_ASSIST</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm font-mono ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-white border border-slate-700' 
                : 'bg-green-900/20 text-green-100 border border-green-900/50'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-green-900/20 rounded-lg p-3 text-sm font-mono border border-green-900/50">
              <span className="animate-pulse">Processing...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-900 rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter query..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-green-500 placeholder:text-slate-600"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-slate-950 p-2 rounded transition"
          >
            <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}