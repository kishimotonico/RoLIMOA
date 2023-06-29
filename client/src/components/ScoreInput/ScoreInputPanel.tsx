import { FC } from 'react';
import { FieldSideType } from '@/slices/score';
import { NHK2023CustomControlPanel } from './nhk2023';


type ScoreInputPanelProps = {
  fieldSide: FieldSideType,
};

export const ScoreInputPanel: FC<ScoreInputPanelProps> = () => {
  // NHK2023仕様のカスタム実装
  return <NHK2023CustomControlPanel />;
};
