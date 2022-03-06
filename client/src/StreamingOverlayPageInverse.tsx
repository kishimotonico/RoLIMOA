import { FC } from 'react';
import { makeStyles } from '@material-ui/core';
import { TimerDisplayV2Container } from './TimerDisplayV2Container';
import { ScoreBlockV4 } from './ScoreBlockV4';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '1600px',
    height: '900px',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  header: {
    display: 'flex',
    width: '100%',
    height: '260px',
  },
}));

export const StreamingOverlayPageInverse: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <ScoreBlockV4 fieldSide="blue" />
        <TimerDisplayV2Container />
        <ScoreBlockV4 fieldSide="red" />
      </div>
    </div>
  );
}
