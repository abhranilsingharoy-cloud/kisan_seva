import { create } from "zustand";

export type ChatLanguage = "en" | "hi" | "bn";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  action?: string | null;
  action_hint?: string | null;
  timestamp: Date;
}

interface ChatStore {
  isOpen: boolean;
  language: ChatLanguage;
  messages: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  setLanguage: (lang: ChatLanguage) => void;
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setListening: (v: boolean) => void;
  setSpeaking: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  language: "en",
  messages: [],
  isListening: false,
  isSpeaking: false,
  isLoading: false,
  setOpen: (open) => set({ isOpen: open }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setLanguage: (language) => set({ language }),
  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: `${Date.now()}-${Math.random()}`, timestamp: new Date() },
      ],
    })),
  setListening: (isListening) => set({ isListening }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] }),
}));
