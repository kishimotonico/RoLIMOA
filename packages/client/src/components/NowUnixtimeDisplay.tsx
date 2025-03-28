import { type FC, useState, useRef, useEffect } from 'react';
import { Box, Typography, Avatar, Fade } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const REFRESH_INTERVAL = 25; // だいたい40fps

function padZero(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

type FormattedTime = {
  date: string;
  h: number;
  m: number;
  s: number;
  ms: number;
};

type Props = {
  offsetTime?: number;
};

export const NowUnixtimeDisplay: FC<Props> = ({ offsetTime = 0 }) => {
  const [nowTime, setNowTime] = useState<FormattedTime>({
    date: '',
    h: 0,
    m: 0,
    s: 0,
    ms: 0,
  });
  const [isPluse, setIsPluse] = useState<boolean>(false);
  const beforeSeconds = useRef<number>(0);
  const timerHandler = useRef<ReturnType<typeof setInterval> | undefined>();

  useEffect(() => {
    timerHandler.current = setInterval(() => {
      const now = new Date(Date.now() + offsetTime);
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();
      const ms = now.getMilliseconds();
      const date = now.toLocaleDateString('ja-JP');

      if (s !== beforeSeconds.current) {
        setIsPluse(true);
        beforeSeconds.current = s;
      } else {
        setIsPluse(false);
      }

      setNowTime({ date, h, m, s, ms });
    }, REFRESH_INTERVAL);

    return () => {
      if (timerHandler.current) {
        clearInterval(timerHandler.current);
      }
    };
  }, [offsetTime]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Box sx={{ mr: 3 }}>
        <Typography component="span" sx={{ color: 'grey', px: 0.5 }}>
          {nowTime.date}
        </Typography>

        <Typography component="span" sx={{ color: 'grey' }}>
          {padZero(nowTime.h)}:{padZero(nowTime.m)}
        </Typography>

        <Typography component="span" sx={{ pr: 0.5 }}>
          :
        </Typography>

        <Typography component="span" sx={{ fontSize: '36px' }}>
          {padZero(nowTime.s)}
        </Typography>

        <Typography component="span" sx={{ px: 0.5, fontSize: '36px' }}>
          .
        </Typography>

        <Typography component="span" sx={{ fontSize: '36px' }}>
          {`000${nowTime.ms}`.slice(-3, -1)}0 {/* 0埋めと切り上げ */}
        </Typography>
      </Box>

      <Box>
        <Fade in={isPluse} timeout={{ enter: 0, exit: 1200 }}>
          <Avatar>
            <AccessTimeFilledIcon />
          </Avatar>
        </Fade>
      </Box>
    </Box>
  );
};
