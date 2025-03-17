import { Dashboard } from '@/components/Dashboard';
import { MatchResultContainer } from '@/components/Referee/MatchResultContainer';


export const RefereePage = () => {
  return (
    <Dashboard title="主審入力">
      <MatchResultContainer />
    </Dashboard>
  );
};
