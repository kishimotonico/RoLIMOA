import React, { FC } from 'react';
import { Typography, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import "dseg/css/dseg.css";

const useStyles = makeStyles((theme) => ({
  displayDescription: {
    minHeight: (prop: TimerDisplayStyleProps) => `${theme.typography[prop.descriptionVariant].lineHeight}em`,
  },
  displayTime: {
    fontFamily: "DSEG14-Classic",
    fontWeight: 500,
  },
}));

type TimerDisplayComponentProps = Partial<TimerDisplayStyleProps> & {
  displayTime: string|number;
  description: string;
};

export type TimerDisplayStyleProps = {
  descriptionVariant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption";
  displayTimeVariant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption";
};

export const TimerDisplayComponent: FC<TimerDisplayComponentProps> = ({
  displayTime,
  description,
  descriptionVariant = "h4",
  displayTimeVariant = "h1",
}) => {
  const classes = useStyles({ descriptionVariant, displayTimeVariant });

  return (
    <Grid item container justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <Typography component="p" variant={descriptionVariant} align="center" color="textSecondary" className={classes.displayDescription}>
          {description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography component="p" variant={displayTimeVariant} align="center" className={classes.displayTime}>
          {displayTime}
        </Typography>
      </Grid>
    </Grid>
  );
}
