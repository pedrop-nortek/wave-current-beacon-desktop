import { useRef, useCallback } from 'react';

export const useAlertSound = (enabled: boolean = true) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/notification.mp3');
      audioRef.current.volume = 0.5;
      audioRef.current.preload = 'auto';
    }
  }, []);

  const playAlertSound = useCallback(() => {
    if (!enabled) return;

    const now = Date.now();
    // Prevent spam - only play sound if last sound was more than 2 seconds ago
    if (now - lastPlayTimeRef.current < 2000) return;

    try {
      initializeAudio();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.warn('Could not play alert sound:', error);
        });
        lastPlayTimeRef.current = now;
      }
    } catch (error) {
      console.warn('Alert sound error:', error);
    }
  }, [enabled, initializeAudio]);

  return { playAlertSound };
};