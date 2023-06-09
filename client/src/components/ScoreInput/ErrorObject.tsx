import { FC } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { TaskObjectConfigType } from 'config/types';

interface ErrorObjectProps {
  config: TaskObjectConfigType,
}

export const ErrorObject: FC<ErrorObjectProps> = ({
  config,
}) => {
  const { description } = config;

  return (
    <Grid item xs={12} sm={6}>
      <Paper sx={{ p: '1em', userSelect: "none" }}>
        <Typography component="h2" variant="h6" gutterBottom>
          {description}
        </Typography>
        <Box sx={{ py: 1 }}>
          ⚠️ エラー
        </Box>
        <Box sx={{ fontSize: '12px' }}>
          ページを再読み込みするか、config.jsonを見直してください
        </Box>
      </Paper>
    </Grid>
  );
};
