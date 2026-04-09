'use client';
import { useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function SocketProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
      transports: ['websocket'],
    });

    socket.on('saleStarted', (data: { message: string }) => {
      setNotification(data.message);
      setTimeout(() => setNotification(null), 5000);
    });

    return () => { socket?.disconnect(); };
  }, []);

  return (
    <>
      {notification && (
        <div className="toast-notification">
          <div className="toast-content">
            <span className="toast-icon">🔔</span>
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="toast-close">×</button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
