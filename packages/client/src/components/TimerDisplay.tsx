import { useDisplayTimer } from '@/functional/useDisplayTimer';
import { Grid2, type SxProps, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption';

type TimerDisplayProps = {
  descriptionVariant?: TypographyVariant;
  descriptionSx?: SxProps;
  displayTimeVariant?: TypographyVariant;
  displayTimeSx?: SxProps;
};

export const TimerDisplay = ({
  descriptionVariant = 'h4',
  descriptionSx = {},
  displayTimeVariant = 'h1',
  displayTimeSx = {},
}: TimerDisplayProps) => {
  const { description, displayTime } = useDisplayTimer();

  return (
    <Grid2 container justifyContent="center" spacing={1}>
      <Grid2 size={12}>
        <Typography
          component="p"
          variant={descriptionVariant}
          color="textSecondary"
          sx={{
            textAlign: 'center',
            minHeight: (theme: Theme) => `${theme.typography[descriptionVariant].lineHeight}em`,
            ...descriptionSx,
          }}
        >
          {description}
        </Typography>
      </Grid2>
      <Grid2 size={12}>
        <Typography
          component="p"
          variant={displayTimeVariant}
          sx={{
            textAlign: 'center',
            fontFamily: 'DSEG14-Classic',
            fontWeight: 500,
            ...displayTimeSx,
          }}
        >
          {displayTime}
        </Typography>
      </Grid2>
    </Grid2>
  );
};
