import { FC, useCallback } from 'react';
import { Switch, Paper, Typography, Badge, BadgeProps, styled, Grid, Box } from '@mui/material';

const AutoLabel = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    left: -80,
    width: '4em',
    top: 20,
    padding: '0 6px',
    backgroundColor: theme.palette.grey[400],
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
    <Paper sx={{ p: { xs: '0.6em', md: '1em 0.7em'}, userSelect: "none" }}>
      <label style={{ cursor: 'pointer' }}>
        <Grid container alignItems='center' justifyContent='space-between'>
          <Grid item xs={8} zeroMinWidth>
              <Typography variant="h6" noWrap>
                {label}
              </Typography>
          </Grid>
          <Grid item xs='auto'>
            <Box sx={{ position: 'relative' }}>
              <AutoLabel badgeContent="AUTO" invisible={!isAuto}>
                <Switch onChange={onChange} color={color} checked={checked} />
              </AutoLabel>
            </Box>
          </Grid>
        </Grid>
      </label>
    </Paper>
  );
};
