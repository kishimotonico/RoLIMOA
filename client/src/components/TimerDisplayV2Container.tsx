import { FC } from 'react';
import { TimerDisplayV2Component } from './TimerDisplayV2Component';
import { useDisplayTimer } from 'functional/useDisplayTimer';

export const TimerDisplayV2Container: FC = ({
  ...rest
}) => {
  const displayTimer = useDisplayTimer();

  return (
    <TimerDisplayV2Component
      displayTime={displayTimer.displayTime}
      description={displayTimer.description}
      {...rest}
    />
  );
}
