import type { FC } from 'react';
import type { FieldSideType } from '@/slices/score';
import { config } from '@/config/load';
import { ScoreInputControl } from './ScoreInputControl';

type ScoreInputPanelProps = {
  fieldSide: FieldSideType;
};

export const ScoreInputPanel: FC<ScoreInputPanelProps> = ({ fieldSide }) => {
  if (config.rule.control_panel?.type === 'custom') {
    // カスタム: config.jsonで指定したUIを表示
    return (
      <>
        {config.rule.control_panel.panels?.map((panel) => (
          <ScoreInputControl
            key={panel.id}
            fieldSide={fieldSide}
            controlPanelConfig={panel}
          />
        ))}
      </>
    );
  }

  // デフォルト: 全てのタスクオブジェクトを表示
  return (
    <>
      {[...config.rule.global_objects, ...config.rule.task_objects].map(
        (config) => (
          <ScoreInputControl
            key={config.id}
            fieldSide={fieldSide}
            taskObjectConfig={config}
          />
        ),
      )}
    </>
  );
};
