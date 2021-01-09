import React, { FC } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';

type StyleProps = {
  fieldColor: "primary"|"secondary",
  isFocused: boolean,
  mainOrLight: "main"|"light",
  verticalPadding: string,
};

const useStyles = makeStyles((theme) => ({
  scoreBlock: {
    width: '100%',
    textAlign: 'center',
    border: (props: StyleProps) => `1px solid ${theme.palette[props.fieldColor][props.mainOrLight]}`,
  },
  scoreBlockHeader: {
    backgroundColor: (props: StyleProps) => theme.palette[props.fieldColor][props.mainOrLight],
    color: theme.palette.background.default,
    lineHeight: 2,
  },
  scoreBlockContent: {
    padding: (props: StyleProps) => `${props.verticalPadding} 0`,
    color: (props: StyleProps) => props.isFocused ? theme.palette.text.primary : theme.palette.text.secondary,
  },
}));

interface ScoreBlockComponentProps {
  score: number;
  fieldSide: "blue"|"red";
  focused?: boolean;
  verticalPadding?: string;
}

export const ScoreBlockComponent: FC<ScoreBlockComponentProps> = ({
  score,
  fieldSide,
  focused = undefined,
  verticalPadding = '.6em',
}) => {
  const classes = useStyles({
    fieldColor: fieldSide === "blue" ? "primary" : "secondary",
    isFocused: focused ?? true,
    mainOrLight: focused ? "main" : "light",
    verticalPadding,
  });

  return (
    <Box className={classes.scoreBlock}>
      <Typography component="div" variant="h6" className={classes.scoreBlockHeader}>
        {"ふぇぇ…チーム"}
      </Typography>
      <Typography component="div" variant="h4" className={classes.scoreBlockContent}>
        {score}
      </Typography>
    </Box>
  );
};
