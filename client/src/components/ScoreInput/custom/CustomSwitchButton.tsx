import { FC, useCallback } from 'react';
import { Switch, Paper, Typography, Badge, BadgeProps, styled, Grid } from '@mui/material';

const AutoLabel = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -24,
    top: 16,
    padding: '0 6px',
    [theme.breakpoints.only('xs')]: {
      right: 12,
      top: 0,
    },
  },
}));

interface CustomSwitchButtonProps {
  color: "primary" | "secondary" | "default",
  value: number,
  label: React.ReactNode,
  isAuto?: boolean,
  onChange: (value: number) => void,
}

export const CustomSwitchButton: FC<CustomSwitchButtonProps> = ({
  color,
  value,
  label,
  isAuto = false,
  onChange: stateUpdate,
}) => {
  const checked = value === 1;
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    stateUpdate(event.target.checked ? 1 : 0);
  }, [stateUpdate]);

  return (
    <Paper sx={{ p: '1em 0.7em', userSelect: "none" }}>
      <label style={{ cursor: 'pointer' }}>
        <Grid container alignItems='center' gap='1em'>
          <Grid item sx={{ mt: '1px' }}>
            <Switch onChange={onChange} color={color} checked={checked} />
          </Grid>
          <Grid item zeroMinWidth>
            <AutoLabel color={color} badgeContent="AUTO" invisible={!isAuto} sx={{ width: '100%' }}>
              <Typography variant="h6" noWrap>
                {label}
              </Typography>
            </AutoLabel>
          </Grid>
        </Grid>
      </label>
    </Paper>
  );
};
