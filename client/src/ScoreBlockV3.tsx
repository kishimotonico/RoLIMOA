import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './features';
import { useDisplayScoreV2 } from './useDisplayScore';
import { makeStyles } from '@material-ui/core';
import config from './config.json';

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
    // backgroundColor: (props: StyleProps) => `${props.color}`,
  },
  scoreBlockContent: {
    fontSize: '100px',
    lineHeight: '140px',
    height: '200px',
  },
  mainScore: {
    display: 'flex',
    justifyContent: 'center',
    height: '80px',
    flexDirection: 'row',
  },
  vgoal: {
    fontSize: '60px',
  },
  subScore: {
    display: 'flex',
    justifyContent: 'center',
    height: '80px',
  },
  subScoreValue: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '60px',
    height: '100px',
  },
  subScoreOp: {
    fontSize: '60px',
    display: 'flex',
    justifyContent: 'center',
    height: '100px',
  },
 }));

type ScoreBlockV3Props = {
  fieldSide: "blue"|"red",
  focused?: boolean,
};

export const ScoreBlockV3: FC<ScoreBlockV3Props> = ({
  fieldSide,
  ...props
}) => {
  const teamName = useSelector<RootState, string>((state) => state.teams[fieldSide]);
  const isScoreVgoaled = useSelector<RootState, number | undefined>((state) => state.score[fieldSide].vgoal);

  const { text, refValues } = useDisplayScoreV2(fieldSide);
  const color = {
    red: "red",
    blue: "blue",
  }[fieldSide];
  const classes = useStyles({
    color,
  });

  return (
    <div className={classes.scoreBlock}>
      <div className={classes.scoreBlockHeader}>
        {teamName}
      </div>
      <div className={classes.scoreBlockContent}>
        <div className={classes.mainScore}>
          {text}
          {isScoreVgoaled && <span className={classes.vgoal}>　{config.rule.vgoal.name}</span>}
        </div>
        <div className={classes.subScore}>
          <div className={classes.subScoreValue}>
            {refValues["1_basic_score"] ?? 0}
          </div>
          <div className={classes.subScoreOp}>
            ＋
          </div>
          <div className={classes.subScoreValue}>
            {refValues["2_box_count_bonus"] ?? 0}
          </div>
          <div className={classes.subScoreOp}>
            ×
          </div>
          <div className={classes.subScoreValue}>
            {refValues["3_time_bonus_coefficient"] ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};
