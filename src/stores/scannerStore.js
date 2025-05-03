// src/stores/scannerStore.js
import { create } from "zustand";

const useScannerStore = create((set) => ({
  // State
  scannedItems: [],
  currentBarcode: null,

  // Actions
  setCurrentBarcode: (barcode) => set({ currentBarcode: barcode }),

  addScannedItem: (item) =>
    set((state) => ({
      scannedItems: [item, ...state.scannedItems],
    })),

  removeScannedItem: (itemId) =>
    set((state) => ({
      scannedItems: state.scannedItems.filter((item) => item.id !== itemId),
    })),

  clearItems: () => set({ scannedItems: [], currentBarcode: null }),

  // Filter items by folder
  getItemsByFolder: (folderId) => {
    return useScannerStore
      .getState()
      .scannedItems.filter((item) => item.folderId === folderId);
  },
}));

export default useScannerStore;
