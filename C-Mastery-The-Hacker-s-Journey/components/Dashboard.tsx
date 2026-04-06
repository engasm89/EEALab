
import React, { useState } from 'react';
import { CURRICULUM } from '../constants';

interface Props {
  xp: number;
  unlockedCount: number;
  isSaving?: boolean;
  onReset: () => void;
}

const RANKS = [
  { name: "Script Kiddie", threshold: 0 },
  { name: "Hello Worlder", threshold: 100 },
  { name: "Segfault Survivor", threshold: 500 },
  { name: "Pointer Master", threshold: 1000 },
  { name: "C Wizard", threshold: 2000 },
  { name: "Kernel Architect", threshold: 3000 },
  { name: "Bitwise Overlord", threshold: 5000 },
  { name: "Memory God", threshold: 10000 }
];

const getRankInfo = (xp: number) => {
  let currentRankIndex = RANKS.length - 1;
  for (let i = 0; i < RANKS.length - 1; i++) {
    if (xp < RANKS[i + 1].threshold) {
      currentRankIndex = i;
      break;
    }
  }

  const currentRank = RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1];

  let progress = 100;
  let nextThreshold = null;

  if (nextRank) {
    const range = nextRank.threshold - currentRank.threshold;
    const gained = xp - currentRank.threshold;
    progress = Math.min(100, Math.max(0, (gained / range) * 100));
    nextThreshold = nextRank.threshold;
  }

  return {
    name: currentRank.name,
    progress,
    nextThreshold
  };
};

export default function Dashboard({ xp, unlockedCount, isSaving = false, onReset }: Props) {
  const { name: rankName, progress, nextThreshold } = getRankInfo(xp);
  const totalLevels = CURRICULUM.length;
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="container mx-auto px-4 h-auto py-3 md:h-20 md:py-0 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-600 rounded flex items-center justify-center font-mono font-bold text-slate-950 shadow-[0_0_10px_rgba(22,163,74,0.5)]">
                C
              </div>
              <h1 className="font-mono font-bold text-lg tracking-tight text-green-400 block">
                C-Mastery<span className="text-slate-500">_Protocol</span>
              </h1>
            </div>
            
            {/* Mobile Rank Display */}
            <div className="md:hidden flex flex-col items-end font-mono text-xs">
               <span className="text-green-400 font-bold">{rankName}</span>
               <span className="text-yellow-500">{xp} XP</span>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-10 font-mono text-sm w-full md:w-auto justify-end">
            {/* Saving Indicator */}
            <div className={`flex items-center gap-2 transition-opacity duration-300 ${isSaving ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-[10px] text-yellow-500 tracking-widest uppercase">Saving...</span>
            </div>

            {/* Settings Button */}
            <button 
              onClick={() => setShowSettings(true)}
              className="text-slate-400 hover:text-green-400 transition-colors p-1"
              title="System Configuration"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Desktop Rank Display */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-slate-500 text-[10px] uppercase tracking-widest">Rank</span>
              <span className="text-green-400 font-bold text-shadow-sm">{rankName}</span>
            </div>
            
            {/* XP Progress Bar */}
            <div className="flex flex-col items-end w-full md:w-[160px]">
              <div className="flex justify-between w-full text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 gap-2">
                <span>XP Progress</span>
                <span className="text-yellow-500 font-bold">{xp}{nextThreshold ? ` / ${nextThreshold}` : ''}</span>
              </div>
              
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative group shadow-inner" title={`Progress to next rank: ${Math.round(progress)}%`}>
                {/* The Moving Bar */}
                <div 
                  className="h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(234,179,8,0.4)] relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Subtle Pulse Overlay */}
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  
                  {/* Leading Edge Highlight (The "Head" of the bar) */}
                  <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/80 shadow-[0_0_8px_white]"></div>
                </div>
              </div>
            </div>

            {/* Level Progress Visual - Wrapped for 20 levels */}
            <div className="flex flex-col items-end hidden lg:flex">
              <span className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Journey</span>
              <div className="flex flex-wrap justify-end gap-1 w-[160px]">
                {Array.from({ length: totalLevels }).map((_, i) => {
                  const isUnlocked = i < unlockedCount;
                  return (
                    <div 
                      key={i}
                      className={`w-1.5 h-3 rounded-[1px] transition-all duration-500 ${
                        isUnlocked 
                          ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] scale-100' 
                          : 'bg-slate-800 border border-slate-700 scale-90'
                      }`}
                      title={`Level ${i + 1}: ${isUnlocked ? 'Unlocked' : 'Locked'}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="font-mono font-bold text-white">System Configuration</h3>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* AI Settings */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-green-400 uppercase tracking-wider">Neural Link (AI Provider)</label>
                <div className="relative">
                  <select className="w-full bg-slate-950 border border-slate-700 text-slate-300 text-sm font-mono rounded p-3 focus:outline-none focus:border-green-500 appearance-none">
                    <option value="gemini">Google Gemini 2.5 Flash (Active)</option>
                    <option value="openai" disabled>OpenAI GPT-4o (Module Not Installed)</option>
                    <option value="anthropic" disabled>Anthropic Claude 3.5 (Module Not Installed)</option>
                  </select>
                  <div className="absolute right-3 top-3.5 text-green-500 pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono text-green-400 uppercase tracking-wider">Access Token</label>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value="********************************" 
                    disabled 
                    className="flex-1 bg-slate-950 border border-slate-700 text-slate-500 text-sm font-mono rounded p-3 cursor-not-allowed"
                  />
                  <div className="bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400 rounded p-3 flex items-center">
                    System Env
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  * Key loaded securely from project environment. Manual override disabled by protocol.
                </p>
              </div>

              <hr className="border-slate-800" />

              {/* Danger Zone */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-red-400 uppercase tracking-wider">Danger Zone</label>
                <div className="bg-red-950/20 border border-red-900/30 rounded p-4 flex flex-col gap-3">
                  <p className="text-xs text-red-200/70 font-mono">
                    System corruption? Initiate a factory reset to wipe all XP and progress. This action cannot be undone.
                  </p>
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      onReset();
                    }}
                    className="w-full bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 text-sm font-mono font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Factory Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
