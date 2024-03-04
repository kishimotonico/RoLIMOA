import { FC, useCallback } from 'react';
import { Switch, Paper, Typography, FormControlLabel, Badge, BadgeProps, styled } from '@mui/material';

const AutoLabel = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: -24,
    top: 16,
    padding: '0 6px',
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
    <Paper sx={{ p: '1em', userSelect: "none" }}>
      <FormControlLabel 
        label={
          <AutoLabel color={color} badgeContent="AUTO" invisible={!isAuto} >
            <Typography variant="h6">
              {label}
            </Typography>
          </AutoLabel>
        }
        control={
            <Switch onChange={onChange} color={color} checked={checked}/>
        }
        sx={{ 
          width: '100%',
         }}
      />
    </Paper>
  );
};
