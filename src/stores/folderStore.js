// src/stores/folderStore.js - Fixed version
import { create } from "zustand";

const useFolderStore = create((set, get) => ({
  folders: [],
  activeFolder: null,

  // Fetch all folders from API
  fetchFolders: async () => {
    try {
      const response = await fetch("http://localhost:3000/api/folders");
      if (!response.ok) throw new Error("Failed to fetch folders");
      const folders = await response.json();
      set({ folders });
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw error;
    }
  },

  // Create folder via API
  createFolder: async (name) => {
    try {
      const response = await fetch("http://localhost:3000/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to create folder");
      const newFolder = await response.json();

      set((state) => ({
        folders: [...state.folders, newFolder],
      }));

      return newFolder;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  },

  // Update active folder
  setActiveFolder: (folderId) => set({ activeFolder: folderId }),

  // Delete folder via API
  deleteFolder: async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/folders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete folder");

      set((state) => ({
        folders: state.folders.filter((folder) => folder.id !== id),
        activeFolder: state.activeFolder === id ? null : state.activeFolder,
      }));
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw error;
    }
  },
}));

export default useFolderStore;
