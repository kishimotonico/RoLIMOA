import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';
import { timerClockState } from './atoms/timerClockState';
import { RootState } from './features';
import { PhaseState } from './features/phase';
import * as Phase from "./util/PhaseStateUtil";

export const usePlayBeepIfNeeded = () => {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const elapsedSec = useRecoilValue(timerClockState);

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
