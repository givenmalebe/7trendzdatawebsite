import { useEffect, useRef, useCallback, useState } from 'react';

type WebSocketMessage = {
  type: string;
  data: unknown;
};

export function useWebSocket(url: string) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>();
  const listeners = useRef<Map<string, Set<(data: unknown) => void>>>(new Map());

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setConnected(true);
        console.log('[WS] Connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as WebSocketMessage;
          setLastMessage(msg);
          const handlers = listeners.current.get(msg.type);
          if (handlers) {
            handlers.forEach(handler => handler(msg.data));
          }
        } catch (e) {
          console.error('[WS] Parse error:', e);
        }
      };

      ws.current.onclose = () => {
        setConnected(false);
        console.log('[WS] Disconnected, reconnecting in 3s...');
        reconnectTimeout.current = setTimeout(connect, 3000);
      };

      ws.current.onerror = (err) => {
        console.error('[WS] Error:', err);
      };
    } catch (e) {
      console.error('[WS] Connection failed:', e);
      reconnectTimeout.current = setTimeout(connect, 3000);
    }
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [connect]);

  const subscribe = useCallback((type: string, handler: (data: unknown) => void) => {
    if (!listeners.current.has(type)) {
      listeners.current.set(type, new Set());
    }
    listeners.current.get(type)!.add(handler);
    return () => {
      listeners.current.get(type)?.delete(handler);
    };
  }, []);

  const send = useCallback((type: string, data: unknown) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, data }));
    }
  }, []);

  return { connected, lastMessage, subscribe, send };
}
