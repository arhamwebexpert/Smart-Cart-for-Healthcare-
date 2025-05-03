// src/stores/folderStore.js
import { create } from "zustand";

const useFolderStore = create((set) => ({
  // State
  folders: [],
  activeFolder: null,

  // Actions
  createFolder: (name) => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      folders: [...state.folders, newFolder],
    }));

    return newFolder;
  },

  updateFolder: (id, data) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...data } : folder
      ),
    })),

  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
      activeFolder: state.activeFolder === id ? null : state.activeFolder,
    })),

  setActiveFolder: (folderId) => set({ activeFolder: folderId }),

  // Helper to get active folder data
  getActiveFolder: () => {
    const { folders, activeFolder } = useFolderStore.getState();
    return folders.find((folder) => folder.id === activeFolder);
  },
}));

export default useFolderStore;
