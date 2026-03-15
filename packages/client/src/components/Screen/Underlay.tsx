import { Box } from '@mui/material';
import type { FieldSideType } from '@rolimoa/common/redux';
import { useCurrentMatchState } from '~/functional/useCurrentMatchState';

const NOTES_COLORS = [
  { id: 'red_notes', label: '赤', color: '#e53935', bgLight: 'rgba(229, 57, 53, 0.1)' },
  { id: 'blue_notes', label: '青', color: '#1e88e5', bgLight: 'rgba(30, 136, 229, 0.1)' },
  { id: 'yellow_notes', label: '黄', color: '#f9a825', bgLight: 'rgba(249, 168, 37, 0.1)' },
] as const;

const NoteCircle = ({ filled, color, size }: { filled: boolean; color: string; size: number }) => (
  <Box
    sx={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      border: `4px solid ${color}`,
      backgroundColor: filled ? color : 'transparent',
      mx: '4px',
      transition: 'background-color 0.3s ease',
    }}
  />
);

const TeamNotesDisplay = ({ fieldSide }: { fieldSide: FieldSideType }) => {
  const { taskObjects } = useCurrentMatchState(fieldSide);
  const enteredNotesArea = (taskObjects.entered_notes_area ?? 0) >= 1;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        flex: 1,
      }}
    >
      {/* ノーツエリア進入インジケータ */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '24px',
          color: enteredNotesArea ? '#4caf50' : 'rgba(0,0,0,0.3)',
          fontWeight: 600,
        }}
      >
        <Box
          sx={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: enteredNotesArea ? '#4caf50' : 'rgba(0,0,0,0.15)',
            border: '3px solid',
            borderColor: enteredNotesArea ? '#4caf50' : 'rgba(0,0,0,0.2)',
          }}
        />
        エリア進入
      </Box>
      {/* 各色のノーツ */}
      <Box sx={{ display: 'flex', gap: '24px' }}>
        {NOTES_COLORS.map((nc) => {
          const count = taskObjects[nc.id] ?? 0;
          return (
            <Box
              key={nc.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: count >= 2 ? nc.bgLight : 'transparent',
                border: count >= 2 ? `2px solid ${nc.color}` : '2px solid transparent',
                transition: 'all 0.3s ease',
              }}
            >
              <Box sx={{ fontSize: '20px', fontWeight: 700, color: nc.color }}>
                {nc.label}
              </Box>
              <Box sx={{ display: 'flex' }}>
                <NoteCircle filled={count >= 1} color={nc.color} size={36} />
                <NoteCircle filled={count >= 2} color={nc.color} size={36} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

type UnderlayProps = {
  reverse?: boolean;
  gap?: number;
};

export const Underlay = ({ gap = 120 }: UnderlayProps) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      gap: `${gap}px`,
      pt: '280px',
    }}
  >
    <TeamNotesDisplay fieldSide="red" />
    <TeamNotesDisplay fieldSide="blue" />
  </Box>
);
