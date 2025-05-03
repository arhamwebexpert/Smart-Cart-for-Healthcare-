// src/hooks/useScanner.js
import { useState, useEffect, useCallback } from "react";

// Define the sample barcodes that match the product database
const sampleBarcodes = [
  "8901234567890", // Organic Greek Yogurt
  "5901234567891", // Whole Grain Bread
  "7801234567892", // Almond Butter
  "4401234567893", // Atlantic Salmon Fillet
  "9301234567894", // Quinoa
];

const useScanner = () => {
  const [status, setStatus] = useState("disconnected"); // 'disconnected', 'connecting', 'connected'
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  // Connect to scanner
  const connect = useCallback(() => {
    setStatus("connecting");
    setError(null);

    // In a real app, this would connect to a real scanner via WebUSB, Bluetooth, or other means
    // For this example, we'll simulate a connection
    const timeout = setTimeout(() => {
      setStatus("connected");
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  // Disconnect from scanner
  const disconnect = useCallback(() => {
    setStatus("disconnected");
  }, []);

  // Scan an item
  const scan = useCallback(() => {
    if (status !== "connected") {
      setError("Scanner not connected");
      return Promise.reject(new Error("Scanner not connected"));
    }

    setScanning(true);
    setError(null);

    // In a real app, this would trigger an actual scan
    // For this example, we'll simulate scanning
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Randomly select one of our sample barcodes (80% chance)
          // or generate a random one (20% chance)
          let barcode;
          if (Math.random() < 0.8) {
            // Use one of our predefined barcodes
            const randomIndex = Math.floor(
              Math.random() * sampleBarcodes.length
            );
            barcode = sampleBarcodes[randomIndex];
          } else {
            // Generate random barcode
            barcode = Math.floor(
              100000000000 + Math.random() * 900000000000
            ).toString();
          }

          setScanning(false);
          resolve(barcode);
        } catch (err) {
          setScanning(false);
          setError("Failed to scan item");
          reject(err);
        }
      }, 800);
    });
  }, [status]);

  // Auto-connect on mount
  useEffect(() => {
    const cleanup = connect();

    // Disconnect on unmount
    return () => {
      cleanup();
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    status,
    scanning,
    error,
    connect,
    disconnect,
    scan,
  };
};

export default useScanner;
