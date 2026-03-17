import { Box } from '@mui/material';

type NotesColor = {
  label: string;
  color: string;
  count: number;
};

type NotesIndicatorProps = {
  notes: NotesColor[];
  enteredNotesArea: boolean;
};

const NoteCircle = ({ filled, color }: { filled: boolean; color: string }) => (
  <Box
    sx={{
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: `2px solid ${color}`,
      backgroundColor: filled ? color : 'transparent',
      mx: '2px',
    }}
  />
);

const NotesRow = ({ label, color, count }: NotesColor) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <Box
      sx={{
        fontSize: '14px',
        width: '24px',
        textAlign: 'center',
        color: color,
        fontWeight: 700,
      }}
    >
      {label}
    </Box>
    <NoteCircle filled={count >= 1} color={color} />
    <NoteCircle filled={count >= 2} color={color} />
  </Box>
);

export const NotesIndicator = ({ notes, enteredNotesArea }: NotesIndicatorProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      px: '8px',
      py: '8px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <Box
        sx={{
          fontSize: '14px',
          width: '24px',
          textAlign: 'center',
          color: enteredNotesArea ? '#4caf50' : 'rgba(0, 0, 0, 0.3)',
          fontWeight: 700,
        }}
      >
        A
      </Box>
      <Box
        sx={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          backgroundColor: enteredNotesArea ? '#4caf50' : 'rgba(0, 0, 0, 0.2)',
          border: '2px solid rgba(0, 0, 0, 0.4)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {enteredNotesArea && (
          <Box sx={{ color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1 }}>✓</Box>
        )}
      </Box>
    </Box>
    {notes.map((note) => (
      <NotesRow key={note.label} {...note} />
    ))}
  </Box>
);
