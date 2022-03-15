import React, { FC } from 'react';
import { useDisplayTimer } from 'functional/useDisplayTimer';
import { Typography, Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';

type TimerDisplayProps = {
  descriptionVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption";
  displayTimeVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption";
};

export const TimerDisplay: FC<TimerDisplayProps> = ({
  descriptionVariant = "h4",
  displayTimeVariant = "h1",
}) => {
  const { description, displayTime } = useDisplayTimer();

  return (
    <Grid item container justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <Typography component="p" variant={descriptionVariant} align="center" color="textSecondary" sx={{
          minHeight: (theme: Theme) => `${theme.typography[descriptionVariant].lineHeight}em`,
        }}>
          {description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography component="p" variant={displayTimeVariant} align="center" sx={{
          fontFamily: "DSEG14-Classic",
          fontWeight: 500,
        }}>
          {displayTime}
        </Typography>
      </Grid>
    </Grid>
  );
}
