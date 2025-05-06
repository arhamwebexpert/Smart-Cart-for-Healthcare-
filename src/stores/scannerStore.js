import { create } from "zustand";

const useScannerStore = create((set, get) => ({
  scannedItems: [],
  currentBarcode: null,

  // Set current barcode
  setCurrentBarcode: (barcode) => set({ currentBarcode: barcode }),

  // Fetch items for active folder
  fetchScannedItems: async (folderId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/folders/${folderId}/items`
      );
      if (!response.ok) throw new Error("Failed to fetch items");
      const items = await response.json();
      set({ scannedItems: items });
    } catch (error) {
      console.error("Error fetching scanned items:", error);
      throw error;
    }
  },

  // Create a scanned item on the server, then add to store
  addScannedItem: async (folderId, { id, barcode }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/folders/${folderId}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, barcode }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save scanned item");
      }
      const newItem = await response.json();
      // prepend to the list
      set((state) => ({
        scannedItems: [newItem, ...state.scannedItems],
      }));
      return newItem;
    } catch (error) {
      console.error("Error creating scanned item:", error);
      throw error;
    }
  },

  clearItems: () => set({ scannedItems: [], currentBarcode: null }),
}));

export default useScannerStore;
