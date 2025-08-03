import type { RootState } from '@rolimoa/common/redux';
import type { PhaseState } from '@rolimoa/common/redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Phase, createTimeConfigMatcher } from '@rolimoa/common/config/helper';
import { usePlaySoundEffect } from './usePlaySoundEffect';

const parseSound = (sound: string | { name: string; volume?: number }) => {
  if (typeof sound === 'string') {
    return { name: sound, volume: undefined };
  }
  return { name: sound.name, volume: sound.volume };
};

export const useAutoPlaySoundEffect = () => {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);

  const { playSound, resumeAudioContext } = usePlaySoundEffect();

  useEffect(() => {
    const phaseConfig = Phase.getConfig(phaseState.current.id);
    const elapsedSec = phaseState.elapsedSecond;

    const matcher = createTimeConfigMatcher(elapsedSec, phaseConfig.duration);
    const matched = phaseConfig.custom?.find(matcher);

    if (!matched?.sound) {
      return;
    }
    const { name: soundName, volume: soundVolume } = parseSound(matched.sound);

    resumeAudioContext()
      .then(() => {
        playSound(soundName, soundVolume);
      })
      .catch((error) => console.error('Failed to play sound:', error));
  }, [phaseState, playSound, resumeAudioContext]);
};
