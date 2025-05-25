// components/PushInitializer.jsx
'use client';

import { useEffect } from 'react';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function PushInitializer() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const handlePush = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service worker registered:', registration);
          console.warn('VAPID PUBLIC KEY:', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);  
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          });

          const res = await fetch(`${BACKEND_URI}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
          });

          const data = await res.json();
          console.log('Push subscription successful:', data);
        } catch (err) {
          console.error('Push subscription failed:', err);
        }
      };

      handlePush();
    }
  }, []);

  return null; // No UI needed
}
