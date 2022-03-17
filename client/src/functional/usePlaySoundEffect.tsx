import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { CurrentPhaseState } from 'slices/phase';
import * as Phase from "util/PhaseStateUtil";

export const usePlaySoundEffect = () => {
  const phaseState = useSelector<RootState, CurrentPhaseState>((state) => state.phase.current);
  const elapsedSec = useSelector<RootState, number>((state) => state.phase.elapsedSecond);

  const phaseConfig = Phase.getConfig(phaseState.id);

  useEffect(() => {
    const matched = phaseConfig.custom?.find(cus => cus.elapsedTime === elapsedSec);
    console.debug(`${phaseConfig.id}: ${elapsedSec} (${matched?.sound})`);
    if (! matched?.sound) {
      return;
    }

    // XXX: ChromeでなくFirefoxのみに対応。そのうちちゃんとライブラリ入れてやりたい
    const audio = new Audio(matched.sound);
    audio.play();

  }, [phaseConfig, elapsedSec]);
};
