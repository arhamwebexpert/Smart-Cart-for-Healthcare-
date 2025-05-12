// hooks/useScanner.js
import { useState } from "react";
import useScannerStore from "../stores/scannerStore";

function useScanner() {
  const [status, setStatus] = useState("disconnected");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const setCurrentBarcode = useScannerStore((s) => s.setCurrentBarcode);

  // Simulate or implement your real hardware connect logic
  async function connect() {
    setStatus("connecting");
    try {
      // await device.open();
      setStatus("connected");
    } catch (err) {
      setStatus("disconnected");
      setError("Failed to connect scanner");
    }
  }

  // Kick off a hardware scan + validate via your GET /api/scan route
  async function scan() {
    if (status !== "connected") {
      setError("Scanner not connected");
      return;
    }

    setError(null);
    setScanning(true);

    try {
      // 1. Get the raw code from your scanner hardware:
      const rawCode = await fakeHardwareScan();
      console.log(rawCode);
      //    replace fakeHardwareScan() with your actual API

      // 2. Validate it against your backend:
      const res = await fetch(
        `http://192.168.18.173:3000/api/scan/${encodeURIComponent(rawCode)}`
      );
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || `Scan failed (${res.status})`);
      }

      const { product } = await res.json();

      // 3. Only push into state if backend says it’s valid
      setCurrentBarcode(product.barcode);
    } catch (err) {
      console.error("Scan error:", err);
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }

  return { status, scanning, error, connect, scan };
}
async function fakeHardwareScan() {
  try {
    const response = await fetch(
      "http://192.168.18.173:3000/api/sendscannedbarcode"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.barcode;
  } catch (error) {
    console.error("Error fetching barcode:", error);
    return null;
  }
}

export default useScanner;
