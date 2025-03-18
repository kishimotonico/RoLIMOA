import { Grid2 } from '@mui/material';
import { Dashboard } from '@/components/Dashboard';
import { MatchResultContainer } from '@/components/Referee/MatchResultContainer';
import { OperationLogTable } from '@/components/Referee/OperationLogTable';


export const RefereePage = () => {
  return (
    <Dashboard title="主審入力">
      <Grid2 container spacing={3}>
        <Grid2 size={12}>
          <MatchResultContainer />
        </Grid2>
        <Grid2 size={12}>
          <OperationLogTable />
        </Grid2>
      </Grid2>
    </Dashboard>
  );
};
