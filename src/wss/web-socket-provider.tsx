"use client";

import { createContext, useContext, useEffect, useRef } from "react";

// ================================
// WebSocket Context
// ================================
// Bu context orqali istalgan component WebSocket instansiga ulanishi mumkin
type WebSocketType = WebSocket | null;
const WebSocketContext = createContext<WebSocketType>(null);

// ================================
// WebSocket Provider
// ================================
// App bo'ylab WebSocket connectionni taqdim etadi
export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  // useRef orqali WebSocket obyekti saqlanadi va state o'zgarmasdan qoladi
  const socketRef = useRef<WebSocketType>(null);

  useEffect(() => {
    // WebSocket server manzili
    const wsUrl = "wss://your-websocket-url"; // <-- Shu yerga server URLni qo'yish
    const ws = new WebSocket(wsUrl);

    // Refni yangilash
    socketRef.current = ws;

    // ================================
    // WebSocket Events
    // ================================

    // Connection ochilganda
    ws.onopen = () => {
      console.log("✅ WebSocket connected to:", wsUrl);
    };

    // Serverdan message kelganda
    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data); // JSON parse
        console.log("📩 WebSocket message received:", data);
      } catch (error) {
        console.error("⚠️ Failed to parse WebSocket message:", msg.data, error);
      }
    };

    // Connection yopilganda
    ws.onclose = (event) => {
      console.log("❌ WebSocket closed:", event.code, event.reason);
    };

    // Xatolik yuz bersa
    ws.onerror = (error) => {
      console.error("🚨 WebSocket error:", error);
    };

    // Cleanup: Component unmount bo'lganda WebSocketni yopish
    return () => {
      if (socketRef.current) {
        console.log("🧹 Closing WebSocket...");
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socketRef.current}>
      {children}
    </WebSocketContext.Provider>
  );
}

// ================================
// Custom Hook
// ================================
// Istalgan componentda WebSocket instansiga osongina ulanish
export const useWebSocket = () => useContext(WebSocketContext);
