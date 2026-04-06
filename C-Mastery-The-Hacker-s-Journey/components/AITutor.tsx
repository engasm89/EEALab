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
    <div className="w-full lg:w-80 bg-lab-panel border border-lab-line rounded-xl flex flex-col shadow-xl h-96 lg:h-auto">
      <div className="p-3 border-b border-lab-line bg-lab-panel rounded-t-xl flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-lab-green animate-pulse"></div>
        <h3 className="font-mono font-bold text-sm text-lab-cyan">AI_TERMINAL_ASSIST</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm font-mono ${
              msg.role === 'user' 
                ? 'bg-lab-panel text-white border border-lab-line' 
                : 'bg-lab-panelDeep/20 text-lab-fg border border-lab-line/50'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-lab-panelDeep/20 rounded-lg p-3 text-sm font-mono border border-lab-line/50">
              <span className="animate-pulse">Processing...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-lab-line bg-lab-panel rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter query..."
            className="flex-1 bg-lab-bg border border-lab-line rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-lab-cyan placeholder:text-lab-muted"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-lab-cyan hover:bg-lab-green disabled:bg-lab-panelDeep text-lab-bg p-2 rounded transition"
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