import config from '@rolimoa/common/config';
import { useCallback, useRef, useState } from 'react';

const soundNames = config.time_progress
  .flatMap((tp) => tp.custom?.map((cus) => cus.sound))
  .map((sound) => (typeof sound === 'string' ? sound : sound?.name))
  .filter((s): s is string => s !== undefined)
  .filter((s, i, arr) => arr.indexOf(s) === i);

type SoundCache = {
  [url: string]: AudioBuffer | null;
};

export const useSoundCache = (ensureAudioContext: () => Promise<AudioContext>) => {
  const [isPreloaded, setIsPreloaded] = useState<boolean>(false);
  const soundCacheRef = useRef<SoundCache>({});

  const loadSound = useCallback(
    async (soundUrl: string): Promise<AudioBuffer | null> => {
      try {
        if (soundCacheRef.current[soundUrl]) {
          return soundCacheRef.current[soundUrl];
        }

        const audioContext = await ensureAudioContext();

        const response = await fetch(soundUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${soundUrl}: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        soundCacheRef.current[soundUrl] = audioBuffer;

        return audioBuffer;
      } catch (error) {
        console.error(`Failed to load sound: ${soundUrl}`, error);
        return null;
      }
    },
    [ensureAudioContext],
  );

  const preloadSounds = useCallback(async () => {
    if (isPreloaded) {
      return;
    }

    try {
      console.log(`Preloading ${soundNames.length} sounds...`);

      const loadPromises = soundNames.map((soundUrl) => loadSound(soundUrl));
      await Promise.all(loadPromises);

      console.log('All sounds preloaded successfully');
      setIsPreloaded(true);
    } catch (error) {
      console.error('Failed to preload sounds:', error);
    }
  }, [loadSound, isPreloaded]);

  const getSoundFromCache = useCallback((soundUrl: string) => {
    return soundCacheRef.current[soundUrl];
  }, []);

  return {
    isPreloaded,
    loadSound,
    preloadSounds,
    getSoundFromCache,
  };
};
