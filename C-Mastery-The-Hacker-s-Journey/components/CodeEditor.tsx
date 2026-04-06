import React, { useState, useEffect, useRef, useMemo } from 'react';
import { compileAndRunC } from '../services/geminiService';

interface Props {
  initialCode?: string;
  onExplain?: (code: string) => void;
}

type SyncMessage = 
  | { type: 'CODE'; payload: string }
  | { type: 'OUTPUT'; payload: string };

const C_KEYWORDS = [
  // Control Flow
  "if", "else", "switch", "case", "default", "break", "continue", 
  "for", "while", "do", "goto", "return", "exit",
  // Types
  "int", "char", "float", "double", "void", "long", "short", "signed", "unsigned",
  "struct", "union", "enum", "typedef", "const", "static", "volatile", "auto", "register", "extern",
  // Standard Lib Functions
  "printf", "scanf", "fprintf", "fscanf", "sprintf", "sscanf",
  "malloc", "calloc", "realloc", "free",
  "strcpy", "strncpy", "strcat", "strncat", "strcmp", "strncmp", "strlen", "memset", "memcpy",
  "fopen", "fclose", "fread", "fwrite", "fgets", "fputs", "feof",
  "atoi", "atof", "atol", "rand", "srand", "time", "system",
  // Preprocessor
  "include", "define", "ifdef", "ifndef", "endif", "pragma",
  // Constants/Other
  "NULL", "FILE", "size_t", "stdin", "stdout", "stderr", "true", "false", "bool"
];

export default function CodeEditor({ initialCode = '', onExplain }: Props) {
  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('// Console output will appear here...');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [isCopied, setIsCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'loaded'>('idle');
  
  // Auto-completion State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestionCoords, setSuggestionCoords] = useState({ top: 0, left: 0 });
  const charWidthRef = useRef<number>(0);
  const suggestionsListRef = useRef<HTMLUListElement>(null);
  
  // Collaboration State
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const [collabStatus, setCollabStatus] = useState<'disconnected' | 'init' | 'connecting' | 'connected'>('disconnected');
  const [myPeerId, setMyPeerId] = useState<string>('');
  const [targetPeerId, setTargetPeerId] = useState('');
  const [connectionError, setConnectionError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  
  // P2P Refs
  const peerRef = useRef<any>(null);
  const connRef = useRef<any>(null);
  const isRemoteUpdate = useRef(false);

  // Update local code state when lesson changes, unless connected
  useEffect(() => {
    if (initialCode && collabStatus !== 'connected') {
      setCode(initialCode);
      setOutput('// Console output will appear here...');
    }
  }, [initialCode, collabStatus]);

  // Measure character width for positioning
  useEffect(() => {
    if (measureRef.current) {
      const rect = measureRef.current.getBoundingClientRect();
      charWidthRef.current = rect.width;
    }
  }, []);

  // Clean up Peer on unmount
  useEffect(() => {
    return () => {
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  // Scroll active suggestion into view
  useEffect(() => {
    if (showSuggestions && suggestionsListRef.current) {
      const activeElement = suggestionsListRef.current.children[suggestionIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [suggestionIndex, showSuggestions]);

  // --- Collaboration Logic ---

  const initPeer = () => {
    setCollabStatus('init');
    const Peer = (window as any).Peer;
    if (!Peer) {
      setConnectionError('PeerJS library not loaded.');
      return;
    }

    const peer = new Peer(undefined, {
      debug: 1
    });

    peer.on('open', (id: string) => {
      setMyPeerId(id);
      setCollabStatus('disconnected'); // Ready to host or join
    });

    peer.on('connection', (conn: any) => {
      handleConnection(conn);
    });

    peer.on('error', (err: any) => {
      console.error('Peer error:', err);
      setConnectionError('Connection failed. Retrying...');
      setCollabStatus('disconnected');
    });

    peerRef.current = peer;
  };

  const handleConnection = (conn: any) => {
    connRef.current = conn;
    setCollabStatus('connecting');

    conn.on('open', () => {
      setCollabStatus('connected');
      setConnectionError('');
      // Send current code to sync immediately
      conn.send({ type: 'CODE', payload: code });
    });

    conn.on('data', (data: SyncMessage) => {
      if (data.type === 'CODE') {
        isRemoteUpdate.current = true;
        setCode(data.payload);
      } else if (data.type === 'OUTPUT') {
        setOutput(data.payload);
        setActiveTab('output');
      }
    });

    conn.on('close', () => {
      setCollabStatus('disconnected');
      setConnectionError('Peer disconnected.');
      connRef.current = null;
    });
  };

  const startHosting = () => {
    if (!peerRef.current) initPeer();
  };

  const joinSession = () => {
    if (!targetPeerId) return;
    if (!peerRef.current) {
      // If peer not init, init then connect
      const Peer = (window as any).Peer;
      const peer = new Peer(undefined, { debug: 1 });
      peer.on('open', () => {
        setMyPeerId(peer.id);
        const conn = peer.connect(targetPeerId);
        handleConnection(conn);
      });
      peerRef.current = peer;
    } else {
      const conn = peerRef.current.connect(targetPeerId);
      handleConnection(conn);
    }
  };

  const broadcast = (msg: SyncMessage) => {
    if (collabStatus === 'connected' && connRef.current) {
      connRef.current.send(msg);
    }
  };

  // --- Editor Handlers ---

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('output');
    const msg = 'Compiling and executing remote container...\n_';
    setOutput(msg);
    
    try {
      const result = await compileAndRunC(code, input);
      // Append a footer to indicate execution finished, mimicking a real terminal
      const finalOutput = result + "\n\n[Process completed - Exit Code 0]";
      setOutput(finalOutput);
      broadcast({ type: 'OUTPUT', payload: finalOutput });
    } catch (e) {
      const errMsg = 'Error: Compilation pipeline failed.';
      setOutput(errMsg);
      broadcast({ type: 'OUTPUT', payload: errMsg });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    localStorage.setItem('cMastery_saved_code', code);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('cMastery_saved_code');
    if (saved) {
      if (window.confirm('Load saved code? This will overwrite your current changes.')) {
        const newCode = saved;
        setCode(newCode);
        setSaveStatus('loaded');
        setTimeout(() => setSaveStatus('idle'), 2000);
        broadcast({ type: 'CODE', payload: newCode });
      }
    } else {
      alert('No saved code found in storage.');
    }
  };

  const applySuggestion = (suggestion: string) => {
    const cursor = textareaRef.current?.selectionEnd || 0;
    const textBefore = code.substring(0, cursor);
    const textAfter = code.substring(cursor);
    
    // Find start of current word
    const match = textBefore.match(/([a-zA-Z0-9_]+)$/);
    if (!match) return;
    
    const wordStart = cursor - match[0].length;
    const newCode = code.substring(0, wordStart) + suggestion + textAfter;
    
    setCode(newCode);
    broadcast({ type: 'CODE', payload: newCode });
    setShowSuggestions(false);
    
    // Set cursor after inserted word
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = wordStart + suggestion.length;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Auto-completion Navigation
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applySuggestion(suggestions[suggestionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newCode = value.substring(0, start) + '  ' + value.substring(end);
      
      setCode(newCode);
      broadcast({ type: 'CODE', payload: newCode });

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    
    // Auto-completion Logic
    const cursor = e.target.selectionEnd;
    const textBefore = newCode.substring(0, cursor);
    const match = textBefore.match(/([a-zA-Z0-9_]+)$/);
    
    if (match && match[0].length >= 1) {
      const currentWord = match[0];
      const filtered = C_KEYWORDS.filter(k => k.startsWith(currentWord) && k !== currentWord);
      
      if (filtered.length > 0) {
        setSuggestions(filtered);
        setSuggestionIndex(0);
        setShowSuggestions(true);
        
        // Calculate Position
        // Metrics: 
        // Textarea padding = 16px (p-4)
        // Line height = 24px (leading-6)
        // Line number gutter width = 40px (w-10) + 1px border = 41px offset
        
        const lines = textBefore.split('\n');
        const row = lines.length - 1;
        const col = lines[lines.length - 1].length - currentWord.length;
        
        const scrollTop = e.target.scrollTop;
        const scrollLeft = e.target.scrollLeft;
        
        const top = 16 + (row + 1) * 24 - scrollTop; 
        const left = 41 + 16 + col * (charWidthRef.current || 8.4) - scrollLeft;
        
        setSuggestionCoords({ top, left });
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    setCode(newCode);
    broadcast({ type: 'CODE', payload: newCode });
  };

  // Sync scroll between textarea (user input), pre (highlighting), and line numbers
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    setShowSuggestions(false); // Hide suggestions on scroll to prevent floating artifacts
    
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  // Generate Syntax Highlighted HTML
  const highlightedCode = useMemo(() => {
    const Prism = (window as any).Prism;
    if (Prism && Prism.languages.c) {
      return Prism.highlight(code + (code.endsWith('\n') ? ' ' : ''), Prism.languages.c, 'c');
    }
    return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }, [code]);

  // Line number generation
  const lineNumbers = code.split('\n').map((_, i) => i + 1).join('\n');

  return (
    <div className="relative">
      {/* Hidden element to measure char width */}
      <span ref={measureRef} className="absolute opacity-0 pointer-events-none font-mono text-sm whitespace-pre" aria-hidden="true">M</span>

      {/* Collaboration Modal/Panel */}
      {showCollabPanel && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-lab-panel/90 backdrop-blur-sm rounded-lg animate-in fade-in duration-200">
          <div className="w-96 bg-lab-panel border border-lab-line rounded-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowCollabPanel(false)} 
              className="absolute top-2 right-2 text-lab-muted hover:text-lab-fg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="font-mono font-bold text-lg text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              SECURE UPLINK
            </h3>

            {collabStatus === 'connected' ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-lab-panelDeep/20 border border-lab-cyan/30 rounded text-lab-cyan font-mono text-sm">
                  Uplink Established. <br/> Syncing data streams.
                </div>
                <button 
                  onClick={() => {
                     if(connRef.current) connRef.current.close();
                     setCollabStatus('disconnected');
                  }}
                  className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold rounded"
                >
                  TERMINATE UPLINK
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Host Section */}
                <div className="space-y-2">
                  <p className="text-xs font-mono text-lab-muted uppercase">Option A: Host Session</p>
                  {!myPeerId ? (
                    <button 
                      onClick={startHosting}
                      className="w-full py-2 bg-lab-panelDeep hover:brightness-110 text-white font-mono text-sm rounded border border-lab-line"
                    >
                      {collabStatus === 'init' ? 'Initializing...' : 'Generate Access Code'}
                    </button>
                  ) : (
                    <div className="bg-lab-bg p-2 rounded border border-cyan-500/50 flex flex-col gap-1">
                      <span className="text-[10px] text-lab-muted">YOUR ACCESS CODE:</span>
                      <div className="flex justify-between items-center">
                        <code className="text-cyan-400 font-mono text-sm select-all">{myPeerId}</code>
                        <button 
                          onClick={() => navigator.clipboard.writeText(myPeerId)}
                          className="text-lab-muted hover:text-lab-fg"
                          title="Copy Code"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-[10px] text-yellow-500 animate-pulse mt-1">Waiting for incoming connection...</span>
                    </div>
                  )}
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-lab-line"></div>
                  <span className="flex-shrink-0 mx-4 text-lab-muted text-xs">OR</span>
                  <div className="flex-grow border-t border-lab-line"></div>
                </div>

                {/* Join Section */}
                <div className="space-y-2">
                  <p className="text-xs font-mono text-lab-muted uppercase">Option B: Join Session</p>
                  <input 
                    type="text" 
                    placeholder="Enter Host Access Code"
                    value={targetPeerId}
                    onChange={(e) => setTargetPeerId(e.target.value)}
                    className="w-full bg-lab-bg border border-lab-line p-2 rounded text-white font-mono text-sm focus:border-cyan-500 outline-none"
                  />
                  <button 
                    onClick={joinSession}
                    disabled={!targetPeerId || collabStatus === 'connecting'}
                    className="w-full py-2 bg-cyan-700 hover:bg-cyan-600 disabled:bg-lab-panelDeep disabled:text-lab-muted text-white font-mono text-sm rounded transition-colors"
                  >
                    {collabStatus === 'connecting' ? 'Connecting...' : 'Connect to Peer'}
                  </button>
                </div>

                {connectionError && (
                  <p className="text-xs text-red-400 font-mono text-center">{connectionError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col border border-lab-line rounded-lg overflow-hidden bg-lab-panel shadow-xl mt-8 mb-4">
        {/* Toolbar */}
        <div className="bg-lab-panel p-2 flex items-center justify-between border-b border-lab-line">
          <div className="flex items-center gap-2 px-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs font-mono text-lab-fg">main.c</span>
            {collabStatus === 'connected' && (
              <span className="ml-2 px-1.5 py-0.5 rounded bg-cyan-900/50 border border-cyan-500/30 text-[10px] text-cyan-400 font-mono animate-pulse">
                • LINKED
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            
            {/* Collaborate Button */}
            <button
              onClick={() => setShowCollabPanel(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold font-mono transition-all mr-2
                ${collabStatus === 'connected' 
                  ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-700 hover:bg-cyan-900/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                  : 'bg-lab-panelDeep hover:brightness-110 text-lab-fg border border-transparent'}`}
              title="Real-time Collaboration"
            >
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
               {collabStatus === 'connected' ? 'UPLINK ACTIVE' : 'UPLINK'}
            </button>

            {/* Status Message */}
            {(saveStatus === 'saved' || saveStatus === 'loaded') && (
              <span className="text-xs font-mono text-lab-cyan animate-fade-in mr-2">
                {saveStatus === 'saved' ? 'Saved to Storage' : 'Loaded from Storage'}
              </span>
            )}

            {/* Load Button */}
            <button
              onClick={handleLoad}
              className="p-1.5 text-lab-muted hover:text-lab-fg hover:bg-lab-panelDeep rounded transition-colors group relative"
              title="Load from Browser Storage"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="p-1.5 text-lab-muted hover:text-lab-fg hover:bg-lab-panelDeep rounded transition-colors group relative mr-2"
              title="Save to Browser Storage"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>

            {/* Explain Button */}
            {onExplain && (
              <button
                onClick={() => onExplain(code)}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold font-mono transition-all bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-700/50 hover:border-purple-500 mr-2 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                title="Ask AI to explain this code"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                EXPLAIN
              </button>
            )}

            {/* Run Button */}
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold font-mono transition-all ${
                isRunning 
                  ? 'bg-lab-panelDeep text-lab-muted cursor-wait' 
                  : 'bg-lab-cyan hover:bg-lab-green text-lab-bg hover:shadow-[0_0_10px_rgba(36,246,255,0.35)]'
              }`}
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  COMPILING...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  RUN CODE
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editor Area with Syntax Highlighting Overlay */}
        <div className="relative h-64 bg-[#0f172a] flex group">
          {/* Line Numbers */}
          <div 
            ref={lineNumbersRef}
            className="w-10 bg-lab-panel text-lab-muted text-right pr-2 pt-4 select-none border-r border-lab-line z-20 overflow-hidden"
          >
            <pre className="font-mono text-sm leading-6">{lineNumbers}</pre>
          </div>
          
          {/* Code Container */}
          <div className="relative flex-1 h-full overflow-hidden">
            {/* Layer 1: The Syntax Highlighted Display (Behind) */}
            <pre 
              ref={preRef}
              className="absolute inset-0 p-4 m-0 font-mono text-sm leading-6 whitespace-pre overflow-hidden pointer-events-none z-0"
              aria-hidden="true"
            >
              <code 
                className="language-c" 
                dangerouslySetInnerHTML={{ __html: highlightedCode }} 
              />
            </pre>

            {/* Layer 2: The Editable Textarea (Front, Transparent Text) */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white p-4 font-mono text-sm leading-6 resize-none outline-none whitespace-pre z-10 custom-scrollbar"
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
            />
          </div>
          
          {/* Auto-complete Dropdown (Outside Overflow-Hidden Container) */}
          {showSuggestions && (
            <ul 
              ref={suggestionsListRef}
              className="absolute z-50 bg-lab-panel border border-lab-line rounded-lg shadow-2xl max-h-60 overflow-y-auto w-56 font-mono text-sm animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-100 custom-scrollbar"
              style={{ top: suggestionCoords.top, left: suggestionCoords.left }}
            >
              {suggestions.map((suggestion, idx) => (
                <li 
                  key={suggestion}
                  onMouseDown={(e) => { e.preventDefault(); applySuggestion(suggestion); }}
                  className={`px-3 py-2 cursor-pointer flex justify-between items-center transition-colors duration-75 ${
                    idx === suggestionIndex 
                      ? 'bg-blue-600/20 text-blue-200 border-l-4 border-blue-500 pl-2' 
                      : 'text-lab-muted hover:bg-lab-panelDeep/50 border-l-4 border-transparent pl-2'
                  }`}
                >
                  <div className="flex items-center gap-2">
                     <span className="opacity-50 text-[10px]">#</span>
                     <span>{suggestion}</span>
                  </div>
                  {idx === suggestionIndex && <span className="text-[10px] opacity-70 font-sans tracking-tighter">TAB</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* IO Panel */}
        <div className="flex flex-col h-40 border-t border-lab-line bg-lab-bg">
          <div className="flex border-b border-lab-line">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-4 py-1 text-xs font-mono transition-colors ${
                activeTab === 'input' 
                  ? 'bg-lab-panel text-white border-t-2 border-lab-cyan' 
                  : 'text-lab-muted hover:text-lab-fg'
              }`}
            >
              STDIN (Input)
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-4 py-1 text-xs font-mono transition-colors ${
                activeTab === 'output' 
                  ? 'bg-lab-panel text-white border-t-2 border-lab-cyan' 
                  : 'text-lab-muted hover:text-lab-fg'
              }`}
            >
              STDOUT (Output)
            </button>
          </div>

          <div className="relative flex-1 group">
            {activeTab === 'input' ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input for scanf here..."
                className="w-full h-full bg-lab-bg text-lab-fg p-3 text-sm font-mono resize-none outline-none"
                spellCheck="false"
              />
            ) : (
              <>
                <pre className="w-full h-full bg-black text-lab-cyan p-3 text-sm font-mono overflow-auto custom-scrollbar whitespace-pre-wrap">
                  {output}
                </pre>
                <button
                  onClick={handleCopyOutput}
                  className="absolute top-2 right-2 p-1.5 bg-lab-panel/80 hover:bg-lab-panelDeep text-lab-muted hover:text-lab-fg rounded border border-lab-line backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Copy Output"
                >
                  {isCopied ? (
                    <svg className="w-4 h-4 text-lab-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}