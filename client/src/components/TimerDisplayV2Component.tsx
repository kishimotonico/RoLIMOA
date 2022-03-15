import { FC } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import "dseg/css/dseg.css";

const useStyles = makeStyles((theme) => ({
  container: {
    width: '400px',
    height: '100%',
    textAlign: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    boxSizing: 'border-box',
    color: 'rgba(240, 240, 240, 0.95)',
  },
  displayDescription: {
    height: '80px',
    lineHeight: '120px',
    fontSize: '24px',
    display: 'flex',
    justifyContent: 'center',
  },
  displayTime: {
    fontFamily: "DSEG14-Classic",
    fontWeight: 500,
    fontSize: '80px',
    lineHeight: '180px',
  },
}));

type TimerDisplayV2ComponentProps = {
  displayTime: string|number;
  description: string;
};

export const TimerDisplayV2Component: FC<TimerDisplayV2ComponentProps> = ({
  displayTime,
  description,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.displayDescription}>
        {description}
      </div>
      <div className={classes.displayTime}>
        {displayTime}
      </div>
    </div>
  );
}
