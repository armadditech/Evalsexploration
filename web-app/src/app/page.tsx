'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TutorialContent from '@/components/TutorialContent';
import Playground from '@/components/Playground';
import Examples from '@/components/Examples';
import Docs from '@/components/Docs';
import OnboardingWizard from '@/components/OnboardingWizard';
import AITutorAssistant from '@/components/AITutorAssistant';
import ContextBanner from '@/components/ContextBanner';
import { useContextStore } from '@/lib/contextStore';

type View = 'tutorial' | 'playground' | 'examples' | 'docs';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('tutorial');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { hasCompletedOnboarding, skipOnboarding } = useContextStore();

  useEffect(() => {
    // Show onboarding for first-time users
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [hasCompletedOnboarding]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleSkipOnboarding = () => {
    skipOnboarding();
    setShowOnboarding(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 overflow-auto flex flex-col">
        <ContextBanner />
        <div className="flex-1 overflow-auto">
          {currentView === 'tutorial' && <TutorialContent />}
          {currentView === 'playground' && <Playground />}
          {currentView === 'examples' && <Examples />}
          {currentView === 'docs' && <Docs />}
        </div>
      </main>

      {/* AI Tutor Assistant - floating on all pages */}
      {hasCompletedOnboarding && <AITutorAssistant />}

      {/* Onboarding Wizard - shows on first visit */}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
        />
      )}
    </div>
  );
}
