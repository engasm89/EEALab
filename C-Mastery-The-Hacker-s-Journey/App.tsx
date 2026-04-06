
import React, { useState, useEffect } from 'react';
import { CURRICULUM } from './constants';
import { Level, UserState, AppView } from './types';
import LevelMap from './components/LevelMap';
import LevelView from './components/LevelView';
import Dashboard from './components/Dashboard';

const INITIAL_STATE: UserState = {
  xp: 0,
  unlockedLevels: [1], // Level 1 is unlocked by default
  completedLevels: []
};

export default function App() {
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('cMasteryState');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [currentView, setCurrentView] = useState<AppView>(AppView.MAP);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Autosave Effect
  useEffect(() => {
    const saveData = async () => {
      setIsSaving(true);
      try {
        localStorage.setItem('cMasteryState', JSON.stringify(userState));
        // Artificial delay to make the UI indicator visible/satisfying
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error("Failed to save progress:", error);
      } finally {
        setIsSaving(false);
      }
    };

    saveData();
  }, [userState]);

  const handleLevelSelect = (levelId: number) => {
    if (userState.unlockedLevels.includes(levelId)) {
      setActiveLevelId(levelId);
      setCurrentView(AppView.LESSON);
    }
  };

  const handleLevelComplete = (levelId: number, xpEarned: number) => {
    setUserState(prev => {
      const isNewCompletion = !prev.completedLevels.includes(levelId);
      const nextLevelId = levelId + 1;
      
      const newUnlocked = [...prev.unlockedLevels];
      if (isNewCompletion && nextLevelId <= CURRICULUM.length && !newUnlocked.includes(nextLevelId)) {
        newUnlocked.push(nextLevelId);
      }

      return {
        ...prev,
        xp: prev.xp + (isNewCompletion ? xpEarned : 0), // Only award XP once per level
        completedLevels: isNewCompletion ? [...prev.completedLevels, levelId] : prev.completedLevels,
        unlockedLevels: newUnlocked
      };
    });
    setCurrentView(AppView.MAP);
    setActiveLevelId(null);
  };

  const handleBackToMap = () => {
    setCurrentView(AppView.MAP);
    setActiveLevelId(null);
  };

  const handleResetProgress = () => {
    if (window.confirm("WARNING: This will wipe all progress and XP. Are you sure?")) {
      localStorage.removeItem('cMasteryState');
      setUserState(INITIAL_STATE);
      setCurrentView(AppView.MAP);
      setActiveLevelId(null);
    }
  };

  const activeLevel = CURRICULUM.find(l => l.id === activeLevelId);

  return (
    <div className="min-h-screen bg-slate-950 text-green-50 font-sans selection:bg-green-900 selection:text-green-50">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50 pointer-events-none"></div>
      
      <Dashboard 
        xp={userState.xp} 
        unlockedCount={userState.unlockedLevels.length} 
        isSaving={isSaving}
        onReset={handleResetProgress}
      />

      <main className="relative z-10 container mx-auto px-4 py-8 pb-24">
        {currentView === AppView.MAP && (
          <LevelMap 
            levels={CURRICULUM} 
            userState={userState} 
            onLevelSelect={handleLevelSelect} 
          />
        )}

        {currentView === AppView.LESSON && activeLevel && (
          <LevelView 
            level={activeLevel} 
            onComplete={handleLevelComplete}
            onExit={handleBackToMap}
          />
        )}
      </main>
    </div>
  );
}
