import { FC } from 'react';
import { FieldSideType } from '@/slices/score';
import { config } from '@/config/load';
import { ScoreInputControl } from './ScoreInputControl';
import { CustomScoreInput } from './custom/CustomScoreInput';


type ScoreInputPanelProps = {
  fieldSide: FieldSideType,
};

export const ScoreInputPanel: FC<ScoreInputPanelProps> = ({
  fieldSide,
}) => {
  // 実装: TypeScriptで直接実装したUIを表示（仮）
  if (config.rule.control_panel?.type === "implement") {
    return <CustomScoreInput fieldSide={fieldSide} />;
  }

  // カスタム: config.jsonで指定したUIを表示
  if (config.rule.control_panel?.type === "custom") {
    return <>
      {
        config.rule.control_panel.panels?.map(panel => (
          <ScoreInputControl
            key={panel.id}
            fieldSide={fieldSide}
            controlPanelConfig={panel}
          />
        ))
      }
    </>;
  }

  // デフォルト: 全てのタスクオブジェクトを表示
  return <>
    {
      [...config.rule.global_objects, ...config.rule.task_objects].map(config => (
        <ScoreInputControl
          key={config.id}
          fieldSide={fieldSide}
          taskObjectConfig={config}
        />
      ))
    }
  </>;
};

