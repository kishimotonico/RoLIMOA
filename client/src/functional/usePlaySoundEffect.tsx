import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { PhaseState } from '@/slices/phase';
import * as Phase from '@/util/PhaseStateUtil';
import { config } from '@/config/load';

const soundNames = config.time_progress.map((tp) => tp.custom?.map((cus) => cus.sound)).flat().filter((s) => s) as string[];

export const usePlaySoundEffect = () => {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);

  const audiosRef = useRef<null | { [name: string]: HTMLAudioElement }>(null);

  // 音声のプリロード
  useEffect(() => {
    soundNames.forEach((name) => {
      if (!audiosRef.current?.[name]) {
        const audio = new Audio(name);
        audio.load();

        console.log(`audio preload: ${name}`);

        audiosRef.current = {
          ...audiosRef.current,
          [name]: audio,
        };
      }
    });
  }, []);

  // 効果音の再生
  useEffect(() => {
    const phaseConfig = Phase.getConfig(phaseState.current.id);
    const elapsedSec = phaseState.elapsedSecond;

    const matched = phaseConfig.custom?.find(cus => cus.elapsedTime === elapsedSec);
    if (! matched?.sound) {
      return;
    }

    const audio = audiosRef.current?.[matched.sound];
    if (audio) {
      audio.play();
      console.debug(`play audio ${matched.sound}`);
    } else {
      (new Audio(matched.sound)).play();
      console.warn(`audio ${matched.sound} is not preloaded`);
    }
  }, [phaseState]);
};
