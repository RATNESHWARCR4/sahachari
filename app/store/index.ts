import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, User } from '@/app/types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Language
  language: Language;
  setLanguage: (language: Language) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Offline Mode
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  
  // Saved Content (for offline access)
  savedStories: string[];
  addSavedStory: (storyId: string) => void;
  removeSavedStory: (storyId: string) => void;
  
  savedWorksheets: string[];
  addSavedWorksheet: (worksheetId: string) => void;
  removeSavedWorksheet: (worksheetId: string) => void;
  
  savedGames: string[];
  addSavedGame: (gameId: string) => void;
  removeSavedGame: (gameId: string) => void;
  
  // Recent items
  recentQuestions: string[];
  addRecentQuestion: (question: string) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  user: null,
  language: 'en' as Language,
  isLoading: false,
  isOffline: false,
  savedStories: [],
  savedWorksheets: [],
  savedGames: [],
  recentQuestions: [],
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setUser: (user) => set({ user }),
      
      setLanguage: (language) => set({ language }),
      
      setIsLoading: (isLoading) => set({ isLoading }),
      
      setIsOffline: (isOffline) => set({ isOffline }),
      
      addSavedStory: (storyId) => 
        set((state) => ({
          savedStories: [...new Set([...state.savedStories, storyId])],
        })),
      
      removeSavedStory: (storyId) =>
        set((state) => ({
          savedStories: state.savedStories.filter((id) => id !== storyId),
        })),
      
      addSavedWorksheet: (worksheetId) =>
        set((state) => ({
          savedWorksheets: [...new Set([...state.savedWorksheets, worksheetId])],
        })),
      
      removeSavedWorksheet: (worksheetId) =>
        set((state) => ({
          savedWorksheets: state.savedWorksheets.filter((id) => id !== worksheetId),
        })),
      
      addSavedGame: (gameId) =>
        set((state) => ({
          savedGames: [...new Set([...state.savedGames, gameId])],
        })),
      
      removeSavedGame: (gameId) =>
        set((state) => ({
          savedGames: state.savedGames.filter((id) => id !== gameId),
        })),
      
      addRecentQuestion: (question) =>
        set((state) => ({
          recentQuestions: [
            question,
            ...state.recentQuestions.filter((q) => q !== question),
          ].slice(0, 10), // Keep only last 10
        })),
      
      reset: () => set(initialState),
    }),
    {
      name: 'sahachari-storage',
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        savedStories: state.savedStories,
        savedWorksheets: state.savedWorksheets,
        savedGames: state.savedGames,
        recentQuestions: state.recentQuestions,
      }),
    }
  )
); 