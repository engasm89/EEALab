
import React, { useState, useEffect } from 'react';
import { CURRICULUM } from './constants';
import { UserState, AppView } from './types';
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
    <div className="min-h-screen bg-lab-bg text-lab-fg font-sans selection:bg-lab-cyan/25 selection:text-lab-fg">
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(1200px 650px at 20% -10%, rgba(36,246,255,0.12), transparent 55%), radial-gradient(900px 500px at 85% 15%, rgba(32,255,122,0.08), transparent 52%)',
        }}
      />
      
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
