import React, { FC } from 'react';
import { TimerDisplayComponent, TimerDisplayStyleProps } from './TimerDisplayComponent';
import { useDisplayTimer } from '../functional/useDisplayTimer';

type TimerDisplayContainerProps = {} & TimerDisplayStyleProps;

export const TimerDisplayContainer: FC<TimerDisplayContainerProps> = ({
  ...rest
}) => {
  const displayTimer = useDisplayTimer();

  return (
    <TimerDisplayComponent
      displayTime={displayTimer.displayTime}
      description={displayTimer.description}
      {...rest}
    />
  );
}
