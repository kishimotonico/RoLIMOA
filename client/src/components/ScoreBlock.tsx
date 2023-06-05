import React, { FC } from 'react';
import { Box, SxProps, Theme, Typography, TypographyVariant } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { FieldSideType } from 'slices/score';
import { useDisplayScore } from 'functional/useDisplayScore';
import { formatTime } from 'util/formatTime';
import { config } from 'config/load';

export type ScoreBlockProps = {
  fieldSide: FieldSideType,
  focused?: boolean,
  // 各要素の描画調整
  rootSx?: SxProps,
  teamNameVariant?: TypographyVariant,
  teamNameSx?: SxProps,
  scoreVariant?: TypographyVariant,
  scoreSx?: SxProps,
};

export const ScoreBlock: FC<ScoreBlockProps> = ({
  fieldSide,
  focused = true,
  rootSx = {},
  teamNameVariant = "h6",
  teamNameSx = {},
  scoreVariant = "h4",
  scoreSx = {},
}) => {
  const teamName = useSelector<RootState, string | undefined>((state) => state.match.teams[fieldSide]?.shortName);
  const { value, scoreState } = useDisplayScore(fieldSide);

  const fieldColor = fieldSide === "blue" ? "primary" : "secondary";
  const mainOrLight = focused ? "main" : "light";

  return (
    <Box sx={{
      width: "100%",
      textAlign: "center",
      border: (theme: Theme) => `1px solid ${theme.palette[fieldColor][mainOrLight]}`,
      ...rootSx,
    }} >
      {/* チーム名 */}
      <Typography component="div" variant={teamNameVariant} sx={{
        lineHeight: 2,
        color: (theme: Theme) => theme.palette.background.default,
        backgroundColor: (theme: Theme) => theme.palette[fieldColor][mainOrLight],
        ...teamNameSx,
      }}>
        {teamName ?? " "}
      </Typography>
      {/* スコア表示 */}
      <Typography component="div" variant={scoreVariant} sx={{
        padding: ".4em 0",
        color: (theme: Theme) => focused ? theme.palette.text.primary : theme.palette.text.secondary,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        ...scoreSx,
      }}>
        <Box sx={{ paddingRight: ".5em", }}>
          {value}
        </Box>
        {scoreState.vgoal && (
          <Box sx={{ fontSize: "40%" }}>
            <Box>
              {config.rule.vgoal.name}
            </Box>
            <Box>
              🏴 {formatTime(scoreState.vgoal, "m:ss")}
            </Box>
          </Box>
        )}
      </Typography>
    </Box>
  );
};
