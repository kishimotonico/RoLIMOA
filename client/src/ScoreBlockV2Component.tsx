import { FC } from 'react';
import { makeStyles } from '@material-ui/core';

type StyleProps = {
  color: string,
};

const useStyles = makeStyles((theme) => ({
  scoreBlock: {
    width: '600px',
    height: '100%',
    textAlign: 'center',
    border: (props: StyleProps) => `8px solid ${props.color}`,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
  },
  scoreBlockHeader: {
    height: '80px',
    lineHeight: '80px',
    borderBottom: (props: StyleProps) => `8px solid ${props.color}`,
    fontSize: '42px',
    display: 'flex',
    justifyContent: 'center',
  },
  scoreBlockContent: {
    fontSize: '120px',
    lineHeight: '180px',
  },
}));

interface ScoreBlockV2ComponentProps {
  score: string;
  teamName: string;
  color: string;
  focused?: boolean;
}

export const ScoreBlockV2Component: FC<ScoreBlockV2ComponentProps> = ({
  score,
  teamName,
  color,
  focused = true,
}) => {
  const classes = useStyles({
    color,
  });

  return (
    <div className={classes.scoreBlock}>
      <div className={classes.scoreBlockHeader}>
        {teamName}
      </div>
      <div className={classes.scoreBlockContent}>
        {score}
      </div>
    </div>
  );
};
