import { Box } from '@mui/material';

type UnderlayProps = {
  reverse?: boolean;
};

export const Underlay = (_props: UnderlayProps) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '100px',
      height: '100%',
    }}
  >
    {/* ここに下要素(試合状況を分かりやすくするカスタマイズ)を実装 */}
  </Box>
);
