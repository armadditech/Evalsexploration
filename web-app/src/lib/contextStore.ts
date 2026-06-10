/**
 * User Context Store using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserContext, defaultContext } from './userContext';

interface ContextStore {
  context: UserContext;
  hasCompletedOnboarding: boolean;

  // Actions
  updateContext: (updates: Partial<UserContext>) => void;
  resetContext: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
}

export const useContextStore = create<ContextStore>()(
  persist(
    (set) => ({
      context: defaultContext,
      hasCompletedOnboarding: false,

      updateContext: (updates) =>
        set((state) => ({
          context: {
            ...state.context,
            ...updates,
            lastUpdated: new Date().toISOString(),
          },
        })),

      resetContext: () =>
        set({
          context: defaultContext,
          hasCompletedOnboarding: false,
        }),

      completeOnboarding: () =>
        set({ hasCompletedOnboarding: true }),

      skipOnboarding: () =>
        set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'eval-tutorial-context',
    }
  )
);
