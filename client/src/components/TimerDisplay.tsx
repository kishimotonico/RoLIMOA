import { FC } from 'react';
import { Typography, SxProps, Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useDisplayTimer } from '@/functional/useDisplayTimer';

type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption";

type TimerDisplayProps = {
  descriptionVariant?: TypographyVariant,
  descriptionSx?: SxProps,
  displayTimeVariant?: TypographyVariant,
  displayTimeSx?: SxProps,
};

export const TimerDisplay: FC<TimerDisplayProps> = ({
  descriptionVariant = "h4",
  descriptionSx = {},
  displayTimeVariant = "h1",
  displayTimeSx = {},
}) => {
  const { description, displayTime } = useDisplayTimer();

  return (
    <Grid item container justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <Typography component="p" variant={descriptionVariant} color="textSecondary" sx={{
          textAlign: "center",
          minHeight: (theme: Theme) => `${theme.typography[descriptionVariant].lineHeight}em`,
          ...descriptionSx,
        }}>
          {description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography component="p" variant={displayTimeVariant} sx={{
          textAlign: "center",
          fontFamily: "DSEG14-Classic",
          fontWeight: 500,
          ...displayTimeSx,
        }}>
          {displayTime}
        </Typography>
      </Grid>
    </Grid>
  );
}
