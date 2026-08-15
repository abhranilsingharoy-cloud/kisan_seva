import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SavedItem {
  id: string;
  title: string;
  type: 'schedule' | 'price' | 'pdf' | 'diagnosis';
  data: any;
  savedAt: number;
}

export interface SyncAction {
  id: string;
  type: 'chat_message' | 'fetch_price';
  payload: any;
  timestamp: number;
}

interface OfflineState {
  savedItems: SavedItem[];
  syncQueue: SyncAction[];
  
  // Actions
  saveItem: (item: Omit<SavedItem, 'id' | 'savedAt'>) => void;
  removeItem: (id: string) => void;
  
  queueAction: (action: Omit<SyncAction, 'id' | 'timestamp'>) => void;
  removeAction: (id: string) => void;
  clearQueue: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      savedItems: [],
      syncQueue: [],
      
      saveItem: (item) => set((state) => ({
        savedItems: [
          { ...item, id: crypto.randomUUID(), savedAt: Date.now() },
          ...state.savedItems
        ]
      })),
      
      removeItem: (id) => set((state) => ({
        savedItems: state.savedItems.filter((i) => i.id !== id)
      })),
      
      queueAction: (action) => set((state) => ({
        syncQueue: [
          ...state.syncQueue,
          { ...action, id: crypto.randomUUID(), timestamp: Date.now() }
        ]
      })),
      
      removeAction: (id) => set((state) => ({
        syncQueue: state.syncQueue.filter((a) => a.id !== id)
      })),
      
      clearQueue: () => set({ syncQueue: [] })
    }),
    {
      name: 'kisanseva-offline-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
