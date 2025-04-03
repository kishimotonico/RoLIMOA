import { Box } from '@mui/material';
import { FieldSideType } from '@/slices/score';
import { useCurrentMatchState } from '@/functional/useCurrentMatchState';

type ScoreSubDisplayProps = {
  fieldSide: FieldSideType,
  placement: "left" | "right",
};

export const ScoreSubDisplay = ({ fieldSide }: ScoreSubDisplayProps) => {
  // @ts-expect-error TS6133 (このコメントは実装時に削除してください)
  const { taskObjects } = useCurrentMatchState(fieldSide); 

  return (
    <Box sx={{ lineHeight: "135px" }}>
      ここに実装
    </Box>
  );
};
