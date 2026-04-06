import React, { useState } from 'react';
import { Level } from '../types';
import AITutor from './AITutor';
import CodeEditor from './CodeEditor';

interface Props {
  level: Level;
  onComplete: (levelId: number, xp: number) => void;
  onExit: () => void;
}

export default function LevelView({ level, onComplete, onExit }: Props) {
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz'>('learn');
  const [quizAnswers, setQuizAnswers] = useState<number[]>(new Array(level.quiz.length).fill(-1));
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [aiTrigger, setAiTrigger] = useState<string>('');

  const currentLesson = level.lessons[currentLessonIdx];

  // Construct full context for AI
  const contextData = `
Lesson: ${currentLesson.title}
Content: ${currentLesson.text.replace(/<[^>]+>/g, '')}
Code Example:
${currentLesson.codeSnippet || "No code provided"}
  `.trim();

  const handleNextLesson = () => {
    // 1. Trigger Completion Animation
    setShowCompletion(true);

    // 2. Wait for animation to show, then start transition
    setTimeout(() => {
      setIsTransitioning(true);
      
      // 3. Hide completion overlay and switch content
      setTimeout(() => {
        setShowCompletion(false);
        if (currentLessonIdx < level.lessons.length - 1) {
          setCurrentLessonIdx(p => p + 1);
          // Scroll to top of content
          const contentContainer = document.getElementById('lesson-content');
          if (contentContainer) contentContainer.scrollTop = 0;
        } else {
          setActiveTab('quiz');
        }
        
        // 4. End transition to show new content
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 600); // Wait for completion animation duration
    }, 400); // Short delay before starting the slide out
  };

  const handleQuizAnswer = (qIndex: number, optionIndex: number) => {
    if (showQuizResult) return;
    const newAnswers = [...quizAnswers];
    newAnswers[qIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    setShowQuizResult(true);
    const isPassed = quizAnswers.every((ans, idx) => ans === level.quiz[idx].correctIndex);
    if (isPassed) {
      // Delay completion slightly for visual effect
      setTimeout(() => onComplete(level.id, level.xpReward), 2000);
    }
  };

  const handleRetryQuiz = () => {
    setShowQuizResult(false);
    setQuizAnswers(new Array(level.quiz.length).fill(-1));
  };

  const handleExplainCode = () => {
    if (currentLesson.codeSnippet) {
      setAiTrigger(`Can you explain this code snippet to me simply?\n\n${currentLesson.codeSnippet}`);
    }
  };

  const score = quizAnswers.reduce((acc, ans, idx) => 
    ans === level.quiz[idx].correctIndex ? acc + 1 : acc
  , 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] relative">
      
      {/* Completion Overlay Animation */}
      {showCompletion && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-lab-panel/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex flex-col items-center animate-in zoom-in-50 duration-300">
            <div className="w-20 h-20 rounded-full bg-lab-green flex items-center justify-center shadow-[0_0_30px_rgba(36,246,255,0.45)] mb-4">
              <svg className="w-10 h-10 text-lab-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-mono font-bold text-lab-cyan tracking-widest animate-pulse">DATA_SYNC_COMPLETE</h2>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-lab-panel border border-lab-line rounded-xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-lab-panel p-4 flex items-center justify-between border-b border-lab-line">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="p-2 hover:bg-lab-panelDeep rounded transition">
              <svg className="w-5 h-5 text-lab-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 className="font-mono font-bold text-lg text-white">{level.title}</h2>
          </div>
          
          <div className="flex bg-lab-panel p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-1 rounded text-sm font-mono transition ${activeTab === 'learn' ? 'bg-lab-cyan text-white' : 'text-lab-muted hover:text-lab-fg'}`}
            >
              LEARN
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-1 rounded text-sm font-mono transition ${activeTab === 'quiz' ? 'bg-lab-cyan text-white' : 'text-lab-muted hover:text-lab-fg'}`}
            >
              QUIZ
            </button>
          </div>
        </div>

        {/* Content */}
        <div id="lesson-content" className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === 'learn' ? (
            <div className={`max-w-3xl mx-auto space-y-8 transition-all duration-500 ease-in-out transform ${isTransitioning ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-lab-cyan font-mono">{currentLesson.title}</h3>
                <div className="flex items-center gap-2">
                  {/* Visual Progress Dots */}
                  <div className="flex gap-1 mr-2">
                    {level.lessons.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${idx <= currentLessonIdx ? 'bg-lab-green' : 'bg-lab-panelDeep'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-lab-muted bg-lab-panel px-2 py-1 rounded border border-lab-line">
                    Part {currentLessonIdx + 1}/{level.lessons.length}
                  </span>
                </div>
              </div>
              
              {/* Content with Rich HTML support */}
              <div className="prose prose-invert prose-green max-w-none">
                <div 
                  className="text-lg leading-relaxed text-lab-fg"
                  dangerouslySetInnerHTML={{ __html: currentLesson.text }}
                />
              </div>

              {currentLesson.codeSnippet && (
                <div className="mt-6 bg-lab-bg rounded-lg border border-lab-line overflow-hidden group shadow-lg">
                  <div className="bg-lab-panel px-4 py-2 text-xs font-mono text-lab-muted flex items-center justify-between border-b border-lab-line">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-lab-green/50"></div>
                      </div>
                      <span>source_code.c</span>
                    </div>
                    
                    <button 
                      onClick={handleExplainCode}
                      className="flex items-center gap-1 text-[10px] bg-lab-panelDeep/30 hover:bg-lab-panelDeep/50 text-lab-cyan px-2 py-1 rounded border border-lab-line transition-colors"
                      title="Ask AI to explain this code"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ANALYZE_CODE
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto custom-scrollbar">
                    <code className="font-mono text-sm text-lab-fg">{currentLesson.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* INTEGRATED IDE */}
              <div className="mt-8 mb-4">
                <h4 className="text-sm font-mono text-lab-cyan uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-lab-green inline-block"></span>
                  Terminal Access (Live Editor)
                </h4>
                <p className="text-xs text-lab-muted mb-2">Modify the code below and execute it to see the results instantly.</p>
                <CodeEditor 
                  initialCode={currentLesson.codeSnippet || "// Write your C code here..."} 
                  onExplain={(code) => setAiTrigger(`I am working on this code in the editor. Can you explain it or help me debug it?\n\n\`\`\`c\n${code}\n\`\`\``)}
                />
              </div>

              <div className="pt-8 flex justify-end">
                <button 
                  onClick={handleNextLesson}
                  disabled={isTransitioning || showCompletion}
                  className="bg-lab-cyan hover:bg-lab-green text-lab-bg font-bold font-mono px-6 py-3 rounded transition-all duration-200 flex items-center gap-2 hover:translate-x-1 hover:shadow-[0_0_15px_rgba(36,246,255,0.35)] active:scale-95 disabled:opacity-70 disabled:hover:translate-x-0 disabled:cursor-wait"
                >
                  {currentLessonIdx === level.lessons.length - 1 ? 'Initialize Quiz' : 'Next Topic'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-bold text-white font-mono">System Challenge</h3>
                <p className="text-lab-muted">Verify your knowledge to unlock the next level.</p>
              </div>

              {level.quiz.map((q, qIdx) => (
                <div key={q.id} className="bg-lab-panel/50 p-6 rounded-lg border border-lab-line shadow-md hover:border-lab-line transition-colors">
                  <p className="font-medium text-lg mb-4 text-lab-fg">{qIdx + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      let btnClass = "w-full text-left p-3 rounded font-mono text-sm transition border border-transparent ";
                      if (showQuizResult) {
                        if (oIdx === q.correctIndex) btnClass += "bg-lab-panelDeep/50 border-lab-cyan text-green-200 ";
                        else if (quizAnswers[qIdx] === oIdx) btnClass += "bg-red-900/50 border-red-500 text-red-200 ";
                        else btnClass += "bg-lab-panel text-lab-muted ";
                      } else {
                        btnClass += quizAnswers[qIdx] === oIdx 
                          ? "bg-blue-600 text-white shadow-md " 
                          : "bg-lab-panel hover:bg-lab-panel text-lab-fg ";
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={showQuizResult}
                          onClick={() => handleQuizAnswer(qIdx, oIdx)}
                          className={btnClass}
                        >
                          [{String.fromCharCode(65+oIdx)}] {opt}
                        </button>
                      );
                    })}
                  </div>
                  {showQuizResult && (
                    <div className={`mt-4 p-3 rounded text-sm border ${quizAnswers[qIdx] === q.correctIndex ? 'bg-lab-panelDeep/20 border-lab-cyan/30 text-lab-cyan' : 'bg-red-900/20 border-red-500/30 text-red-400'} animate-in fade-in slide-in-from-top-2`}>
                      <p className="font-bold mb-1 flex items-center gap-2">
                        {quizAnswers[qIdx] === q.correctIndex ? (
                          <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> CORRECT</>
                        ) : (
                          <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> INCORRECT</>
                        )}
                      </p>
                      <p className="text-lab-fg ml-6">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              {!showQuizResult ? (
                <button 
                  onClick={submitQuiz}
                  disabled={quizAnswers.includes(-1)}
                  className="w-full bg-lab-cyan hover:bg-lab-green disabled:bg-lab-panelDeep disabled:cursor-not-allowed disabled:text-lab-muted text-lab-bg font-bold font-mono py-4 rounded transition-all duration-200 shadow-lg hover:shadow-lab-cyan/25 active:scale-[0.99]"
                >
                  COMPILE ANSWERS
                </button>
              ) : (
                <div className="text-center p-6 bg-lab-panel rounded-xl border border-lab-line animate-in zoom-in duration-300">
                  <p className={`text-4xl font-bold mb-2 ${score === level.quiz.length ? 'text-lab-cyan' : 'text-yellow-400'}`}>
                    {Math.round((score / level.quiz.length) * 100)}%
                  </p>
                  <p className="text-lab-muted mb-4">{score === level.quiz.length ? 'Perfect Score! Accessing next level...' : 'System checks failed. Review material.'}</p>
                  {score !== level.quiz.length && (
                    <button 
                      onClick={handleRetryQuiz}
                      className="mt-2 px-6 py-3 bg-lab-panelDeep hover:brightness-110 text-white font-bold font-mono rounded-lg transition border border-lab-line hover:border-lab-cyan/40 hover:shadow-lg"
                    >
                      RETRY MISSION
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Tutor Sidebar */}
      <AITutor 
        currentTopic={level.title} 
        lessonContext={contextData}
        triggerQuery={aiTrigger}
        onQueryReset={() => setAiTrigger('')}
      />
    </div>
  );
}