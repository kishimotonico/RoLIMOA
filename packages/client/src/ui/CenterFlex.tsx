import { Box, type BoxProps } from '@mui/material';

type CenterFlexProp = BoxProps;

export const CenterFlex = ({ sx, children, ...rest }: CenterFlexProp) => {
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
