import { FC, useCallback } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';

interface CustomToggleButtonProps {
  value: number,
  label: string,
  onChange: (value: number) => void,
}

export const CustomToggleButton: FC<CustomToggleButtonProps> = ({
  value,
  label,
  onChange: stateUpdate,
}) => {
  const onChange = useCallback((_: React.MouseEvent<HTMLElement, MouseEvent>, value: number) => {
    stateUpdate(value);
  }, [stateUpdate]);

  return (
    <ToggleButtonGroup
      sx={{ pt: 0.5 }}
      onChange={onChange} 
      exclusive 
      orientation='horizontal'
    >
      <ToggleButton value={1} selected={1 === value} color='primary'>
        🔵
      </ToggleButton>
      <ToggleButton value={0} selected={0 === value} color='standard'>
        &nbsp;{label}&nbsp;
      </ToggleButton>
      <ToggleButton value={2} selected={2 === value} color='secondary'>
        🔴
      </ToggleButton>

    </ToggleButtonGroup>
  );
};
