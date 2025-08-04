import { useCallback, useEffect, useRef, useState } from 'react';

export const useAudioContext = () => {
  const [volume, setVolume] = useState<number>(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const ensureAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      console.log('Creating new AudioContext');
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      gainNode.connect(audioContext.destination);
      gainNodeRef.current = gainNode;
    }

    if (audioContextRef.current.state === 'suspended') {
      console.log('Resuming suspended AudioContext');
      await audioContextRef.current.resume();
    }

    if (audioContextRef.current.state === 'closed') {
      console.log('AudioContext was closed, creating a new one');
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      gainNode.connect(audioContext.destination);
      gainNodeRef.current = gainNode;
    }

    return audioContextRef.current;
  }, [volume]);

  const resumeAudioContext = useCallback(async () => {
    try {
      await ensureAudioContext();
      console.log('AudioContext state:', audioContextRef.current?.state);
    } catch (error) {
      console.error('Failed to resume AudioContext:', error);
    }
  }, [ensureAudioContext]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend().catch(console.error);
      }
    };
  }, []);

  return {
    volume,
    setVolume,
    audioContext: audioContextRef.current,
    gainNode: gainNodeRef.current,
    ensureAudioContext,
    resumeAudioContext,
  };
};
