// src/hooks/useWebSocket.js
import { useEffect, useRef } from "react";

const useWebSocket = (url, onMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket(url);

    // Handle incoming messages
    socketRef.current.onmessage = (event) => {
      if (onMessage) {
        onMessage(event.data);
      }
    };

    // Cleanup on unmount
    return () => {
      socketRef.current.close();
    };
  }, [url, onMessage]);

  // Function to send messages
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  return sendMessage;
};

export default useWebSocket;
