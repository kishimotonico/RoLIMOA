import { useCallback } from 'react';
import { useAudioContext } from './useAudioContext';
import { useSoundCache } from './useSoundCache';

export const usePlaySoundEffect = () => {
  const { volume, setVolume, gainNode, ensureAudioContext, resumeAudioContext } = useAudioContext();

  const { isPreloaded, loadSound, preloadSounds, getSoundFromCache } =
    useSoundCache(ensureAudioContext);

  const playSound = useCallback(
    async (soundUrl: string, soundVolume?: number) => {
      try {
        const audioContext = await ensureAudioContext();
        if (!gainNode) {
          console.error('GainNode is not initialized');
          return;
        }

        let audioBuffer = getSoundFromCache(soundUrl);
        if (!audioBuffer) {
          audioBuffer = await loadSound(soundUrl);
          if (!audioBuffer) return;
        }

        const sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;

        if (soundVolume !== undefined) {
          const volumeGainNode = audioContext.createGain();
          volumeGainNode.gain.value = soundVolume;

          sourceNode.connect(volumeGainNode);
          volumeGainNode.connect(gainNode);

          console.debug(`Playing sound: ${soundUrl} at config volume: ${soundVolume}`);
        } else {
          sourceNode.connect(gainNode);

          console.debug(`Playing sound: ${soundUrl} at slider volume: ${volume}`);
        }

        sourceNode.onended = () => console.debug(`Sound ended: ${soundUrl}`);
        sourceNode.start();
      } catch (error) {
        console.error('Sound playback failed:', error);
      }
    },
    [ensureAudioContext, loadSound, getSoundFromCache, gainNode, volume],
  );

  return {
    volume,
    setVolume,
    preloadSounds,
    isPreloaded,
    resumeAudioContext,
    playSound,
  };
};
