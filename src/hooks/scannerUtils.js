// scannerUtils.js
export async function fakeHardwareScan() {
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
