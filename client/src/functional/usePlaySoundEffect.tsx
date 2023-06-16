import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { PhaseState } from 'slices/phase';
import * as Phase from 'util/PhaseStateUtil';

export const usePlaySoundEffect = () => {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);

  useEffect(() => {
    const phaseConfig = Phase.getConfig(phaseState.current.id);
    const elapsedSec = phaseState.elapsedSecond;

    const matched = phaseConfig.custom?.find(cus => cus.elapsedTime === elapsedSec);
    console.debug(`${phaseConfig.id}: ${elapsedSec} (${matched?.sound})`);
    if (! matched?.sound) {
      return;
    }

    // XXX: ChromeでなくFirefoxのみに対応。そのうちちゃんとライブラリ入れてやりたい
    const audio = new Audio(matched.sound);
    audio.play();

  }, [phaseState]);
};
