import { create } from 'zustand'

export const useStore = create((set) => ({
  activeTool: null,
  setActiveTool: (tool) => set({ activeTool: tool }),
  chatMessages: [],
  addChatMessage: (message) => set((state) => ({ 
    chatMessages: [...state.chatMessages, message] 
  })),
  clearChat: () => set({ chatMessages: [] }),
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  isAnalyzing: false,
  setIsAnalyzing: (status) => set({ isAnalyzing: status }),
  avatarMood: 'neutral',
  setAvatarMood: (mood) => set({ avatarMood: mood })
}))
