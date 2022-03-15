import { FC } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { ScoreBlockV2Container } from 'components/ScoreBlockV2Container';
import { TimerDisplayV2Container } from 'components/TimerDisplayV2Container';

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

export const StreamingOverlayPage: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <ScoreBlockV2Container fieldSide="red" />
        <TimerDisplayV2Container />
        <ScoreBlockV2Container fieldSide="blue" />
      </div>
    </div>
  );
}
