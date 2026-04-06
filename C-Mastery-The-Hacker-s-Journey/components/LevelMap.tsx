
import React from 'react';
import { Level, UserState } from '../types';

interface Props {
  levels: Level[];
  userState: UserState;
  onLevelSelect: (id: number) => void;
}

export default function LevelMap({ levels, userState, onLevelSelect }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-mono font-bold text-center mb-12 text-lab-cyan animate-pulse">
        {">"}  SELECT_MISSION
      </h2>
      
      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-lab-line before:to-transparent">
        {levels.map((level, index) => {
          const isUnlocked = userState.unlockedLevels.includes(level.id);
          const isCompleted = userState.completedLevels.includes(level.id);
          const isNext = isUnlocked && !isCompleted;

          return (
            <div 
              key={level.id}
              className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${!isUnlocked ? 'opacity-50 grayscale' : ''}`}
            >
              {/* Icon / Node */}
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-300
                  ${isCompleted ? 'bg-lab-green border-lab-line shadow-[0_0_15px_rgba(36,246,255,0.35)]' : ''}
                  ${isNext ? 'bg-yellow-500 border-yellow-900 animate-bounce shadow-[0_0_15px_rgba(234,179,8,0.5)]' : ''}
                  ${!isUnlocked && !isCompleted ? 'bg-lab-panel border-lab-line' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6 text-lab-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`font-mono font-bold ${isNext ? 'text-lab-bg' : 'text-lab-muted'}`}>{level.id}</span>
                )}
              </div>

              {/* Card */}
              <div 
                onClick={() => onLevelSelect(level.id)}
                className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-lg border bg-lab-panel transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg
                  ${isUnlocked ? 'border-lab-cyan/30 hover:border-lab-cyan' : 'border-lab-line cursor-not-allowed'}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold font-mono text-lg text-lab-green">{level.title}</h3>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-lab-panel text-yellow-400 border border-lab-line">
                    {level.xpReward} XP
                  </span>
                </div>
                <p className="text-sm text-lab-muted mb-3 line-clamp-2">{level.description}</p>
                
                {isUnlocked ? (
                  <button className="text-xs font-bold font-mono text-lab-cyan uppercase tracking-wider hover:underline">
                    {isCompleted ? 'Replay Module' : 'Start Mission'} {"→"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Locked
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
