import { Box } from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import { RootState } from '@/slices';
import { useSelector } from 'react-redux';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { formatTime } from '@/util/formatTime';
import { config } from '@/config/load';

type ScoreBoardProps = {
  fieldSide: "blue" | "red",
  placement: "left" | "right",
};

export const ScoreBoard = ({
  fieldSide,
}: ScoreBoardProps) => {

  const teamName = useSelector<RootState, string>((state) => state.match.teams[fieldSide]?.shortName ?? "");
  const { value, scoreState } = useDisplayScore(fieldSide);
  const color = fieldSide == "blue" ? "rgba(0, 0, 250, 0.9)" : "rgba(250, 0, 0, 0.9)";

  return (
    <Box sx={{
      width: '100%',
      height: '180px',
      border: '2px solid',
      borderColor: color,
      textAlign: 'center',
    }}>
      <Box sx={{
        backgroundColor: color,
        color: 'rgb(240, 240, 240)',
        height: '60px',
        lineHeight: '65px',
        fontSize: '0.7em',
        px: '0.5em',
      }}>
        {teamName}
      </Box>
      <Box sx={{
        height: '120px',
        fontSize: '1.5em',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
      }}>
        <Box>
          {value}
        </Box>
        {scoreState.vgoal && (
          <Box sx={{
            fontSize: "40%",
            ml: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
          }}>
            <Box sx={{
              lineHeight: 1,
              maxHeight: "45%",
            }}>
              {config.rule.vgoal.name}
            </Box>
            <Box sx={{
              maxHeight: "45%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}>
              <TimerOutlinedIcon sx={{ pt: 0.5, fontSize: "120%", color: "rgba(80, 80, 80, 0.9)", textAnchor: "middle" }} />
              {formatTime(scoreState.vgoal, "m:ss")}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
