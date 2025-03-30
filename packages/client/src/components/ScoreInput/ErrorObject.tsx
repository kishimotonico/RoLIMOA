import type { FC } from 'react';
import { Box, Grid2, Paper, Typography } from '@mui/material';

interface ErrorObjectProps {
  description: string;
}

export const ErrorObject: FC<ErrorObjectProps> = ({ description }) => {
  return (
    <Grid2 size={{ xs: 12, sm: 6 }}>
      <Paper sx={{ p: '1em', userSelect: 'none' }}>
        <Typography component="h2" variant="h6" gutterBottom>
          {description}
        </Typography>
        <Box sx={{ py: 1 }}>⚠️ エラー</Box>
        <Box sx={{ fontSize: '12px' }}>
          ページを再読み込みするか、config.jsonを見直してください
        </Box>
      </Paper>
    </Grid2>
  );
};
