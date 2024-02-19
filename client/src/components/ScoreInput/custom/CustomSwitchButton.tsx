import { FC, useCallback } from 'react';
import { Switch, Paper, Typography, FormControlLabel } from '@mui/material';

interface CustomSwitchButtonProps {
  color: "primary" | "secondary" | "default",
  value: number,
  label: React.ReactNode,
  onChange: (value: number) => void,
}

export const CustomSwitchButton: FC<CustomSwitchButtonProps> = ({
  color,
  value,
  label,
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
          <Typography variant="h6">
            {label}
          </Typography>
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
