'use client';

import { useEffect } from 'react';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
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

          const readyRegistration = await navigator.serviceWorker.ready;
          console.log('Service worker ready:', readyRegistration);

          const subscription = await readyRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
          });
          console.log('Push subscription:', subscription);

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/notification/subscribe`, {
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

  return null;
}
