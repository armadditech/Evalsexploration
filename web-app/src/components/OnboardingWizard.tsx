'use client';

import { useState } from 'react';
import { useContextStore } from '@/lib/contextStore';
import {
  AISystemType,
  DOMAIN_EXAMPLES,
  SYSTEM_TYPE_INFO
} from '@/lib/userContext';
import { FaArrowRight, FaArrowLeft, FaRocket, FaTimes } from 'react-icons/fa';

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const { context, updateContext, completeOnboarding } = useContextStore();

  const [localData, setLocalData] = useState({
    systemType: context.aiSystemType,
    domain: context.domain,
    systemDescription: context.systemDescription || '',
    experienceLevel: context.experienceLevel,
    primaryGoal: context.primaryGoal,
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save all data and complete onboarding
      updateContext({
        aiSystemType: localData.systemType,
        domain: localData.domain,
        systemDescription: localData.systemDescription,
        experienceLevel: localData.experienceLevel,
        primaryGoal: localData.primaryGoal,
      });
      completeOnboarding();
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return localData.systemType !== null;
      case 2: return localData.domain !== 'general' || localData.domain === 'general';
      case 3: return localData.systemDescription.length > 10;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Welcome to AI Evals Tutorial! 🎓</h2>
            <button
              onClick={onSkip}
              className="text-white/80 hover:text-white transition"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <p className="text-white/90">
            Let's personalize your learning experience based on your AI system
          </p>

          {/* Progress bar */}
          <div className="mt-4 flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i < step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Step 1: System Type */}
          {step === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What type of AI system are you building?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This helps us recommend the right eval patterns for you
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(SYSTEM_TYPE_INFO) as AISystemType[]).map((type) => {
                  const info = SYSTEM_TYPE_INFO[type];
                  const isSelected = localData.systemType === type;

                  return (
                    <button
                      key={type}
                      onClick={() => setLocalData({ ...localData, systemType: type })}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white mb-1 capitalize">
                        {type}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {info.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Examples: {info.examples[0]}, {info.examples[1]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Domain */}
          {step === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What domain is your AI system in?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We'll use domain-specific examples to make learning more relevant
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(DOMAIN_EXAMPLES).map(([domain, info]) => {
                  const isSelected = localData.domain === domain;

                  return (
                    <button
                      key={domain}
                      onClick={() => setLocalData({ ...localData, domain })}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{info.icon}</span>
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">
                          {domain.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {info.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: System Description */}
          {step === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Describe your AI system
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                A brief description helps us generate personalized examples
              </p>

              <textarea
                value={localData.systemDescription}
                onChange={(e) => setLocalData({ ...localData, systemDescription: e.target.value })}
                placeholder={`Example: "I'm building a customer support chatbot that helps users troubleshoot common issues with our software product"`}
                className="w-full h-40 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />

              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                💡 Be specific! Include what your AI does, what inputs it takes, and what outputs it produces.
              </div>
            </div>
          )}

          {/* Step 4: Experience Level */}
          {step === 4 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What's your experience level with AI evals?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We'll adjust the tutorial pace and depth accordingly
              </p>

              <div className="space-y-3">
                {[
                  {
                    level: 'beginner',
                    label: 'Beginner - New to evals',
                    desc: 'Start with fundamentals and detailed explanations'
                  },
                  {
                    level: 'intermediate',
                    label: 'Intermediate - Some experience',
                    desc: 'Focus on best practices and advanced patterns'
                  },
                  {
                    level: 'advanced',
                    label: 'Advanced - Building production evals',
                    desc: 'Skip basics, focus on optimization and edge cases'
                  },
                ].map(({ level, label, desc }) => {
                  const isSelected = localData.experienceLevel === level;

                  return (
                    <button
                      key={level}
                      onClick={() => setLocalData({ ...localData, experienceLevel: level as any })}
                      className={`
                        w-full p-4 rounded-lg border-2 text-left transition-all
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">
                        {label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Primary Goal */}
          {step === 5 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What's your primary goal?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This helps us prioritize the right content for you
              </p>

              <div className="space-y-3">
                {[
                  {
                    goal: 'learning',
                    label: '📚 Learning - Understand eval concepts',
                    desc: 'Go through tutorials and understand the theory'
                  },
                  {
                    goal: 'building',
                    label: '🔨 Building - Create evals for my system',
                    desc: 'Jump to practical examples and code generation'
                  },
                  {
                    goal: 'debugging',
                    label: '🐛 Debugging - Fix existing evals',
                    desc: 'Focus on troubleshooting and optimization'
                  },
                ].map(({ goal, label, desc }) => {
                  const isSelected = localData.primaryGoal === goal;

                  return (
                    <button
                      key={goal}
                      onClick={() => setLocalData({ ...localData, primaryGoal: goal as any })}
                      className={`
                        w-full p-4 rounded-lg border-2 text-left transition-all
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">
                        {label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-white transition"
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Step {step} of {totalSteps}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === totalSteps ? (
              <>
                Get Started
                <FaRocket />
              </>
            ) : (
              <>
                Next
                <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
