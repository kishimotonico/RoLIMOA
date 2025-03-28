import type { FC } from 'react';
import { Box, type BoxProps } from '@mui/material';

type CenterFlexProp = BoxProps;

export const CenterFlex: FC<CenterFlexProp> = ({ sx, children, ...rest }) => {
  return (
    <Box
      {...rest}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
