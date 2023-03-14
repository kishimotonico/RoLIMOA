import React, { FC } from 'react';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import { FieldSideType } from 'slices/score';
import { useSelector } from 'react-redux';
import { useDisplayScore } from 'functional/useDisplayScore';
import { RootState } from 'slices';

type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption";

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
  const { text } = useDisplayScore(fieldSide);

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
        ...scoreSx,
      }}>
        {text}
      </Typography>
    </Box>
  );
};
