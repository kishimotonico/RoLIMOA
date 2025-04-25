import { useRef } from 'react';
import { Transition } from 'react-transition-group';

type SlideTransitionProps = {
  in: boolean;
  direction: 'left' | 'right';
  appear?: boolean;
  duration?: number;
  children: React.ReactNode;
};

export const SlideTransition = ({
  in: inProp,
  direction,
  duration = 800,
  children,
}: SlideTransitionProps) => {
  const nodeRef = useRef(null);

  const defaultStyle = {
    transition: `${duration}ms ease-in-out`,
    opacity: 0,
  };

  const pos = direction === 'left' ? 80 : -80;

  const transitionStyles = {
    entering: {
      opacity: 1,
      transform: 'translateX(0%)',
    },
    entered: {
      opacity: 1,
      transform: 'translateX(0%)',
    },
    exiting: {
      opacity: 0,
      transform: `translateX(${pos}%)`,
    },
    exited: {
      opacity: 0,
      transform: `translateX(${pos}%)`,
    },
    unmounted: {},
  };

  return (
    <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
      {(state) => (
        <div
          ref={nodeRef}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};
