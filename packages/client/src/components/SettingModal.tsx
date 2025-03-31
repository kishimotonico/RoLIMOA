import { type FC, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSetRecoilState } from 'recoil';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Slider,
  Box,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { connectedDevicesStateSlice } from '@rolimoa/common/redux';
import { unixtimeOffset } from '@/atoms/unixtimeOffset';
import { getSetting, setSetting } from '@/util/clientStoredSetting';
import { LyricalSocket } from '@/lyricalSocket';
import { NowUnixtimeDisplay } from './NowUnixtimeDisplay';

type FormValues = {
  deviceName: string;
  timeOffset: number;
};

type SettingModalProps = {
  open: boolean;
  onClose: () => void;
};

export const SettingModal: FC<SettingModalProps> = ({ open, onClose }) => {
  const savedSetting = getSetting();
  const dispatch = useDispatch();
  const prevDeviceName = useRef<string>(savedSetting.deviceName);
  const setTimeOffset = useSetRecoilState(unixtimeOffset);

  const { control, handleSubmit } = useForm({
    reValidateMode: 'onChange',
    defaultValues: savedSetting,
  });

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    (form) => {
      if (!form) {
        return;
      }

      setSetting(form);

      setTimeOffset(form.timeOffset);

      // デバイス名の変更時は、Reduxのストアも反映
      if (form.deviceName !== prevDeviceName.current) {
        prevDeviceName.current = form.deviceName;

        const action = connectedDevicesStateSlice.actions.addDeviceOrUpdate({
          sockId: LyricalSocket.getSessionId(),
          deviceName: form.deviceName,
        });
        LyricalSocket.dispatch(action, dispatch);
      }

      onClose();
    },
    [onClose, dispatch, setTimeOffset],
  );

  const closeHandler = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <Dialog
      aria-labelledby="setting-modal-title"
      open={open}
      onClose={closeHandler}
      fullWidth
    >
      <DialogTitle id="setting-modal-title">設定</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          適当に設定してください。設定内容は、localStorageに保存します。
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="deviceName"
            render={({ field }) => (
              <Box sx={{ mb: 5 }}>
                <TextField
                  {...field}
                  label="ユーザ・デバイス名"
                  placeholder="篝ノ霧枝＠青コート点数"
                  fullWidth
                />
              </Box>
            )}
          />
          <Controller
            control={control}
            name="timeOffset"
            render={({ field }) => (
              <>
                <Typography id="time-offset-slider" gutterBottom>
                  時刻オフセット: {field.value > 0 ? '+' : ''}
                  {field.value} ms
                </Typography>

                <Box sx={{ userSelect: 'none', px: 1, py: 1 }}>
                  <NowUnixtimeDisplay offsetTime={field.value} />
                </Box>

                <Box sx={{ px: 3 }}>
                  <Slider
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) =>
                      `${value > 0 ? '+' : ''}${value} ms`
                    }
                    min={-2000}
                    max={2000}
                    step={20}
                    marks={[
                      { value: -2000, label: '-2 s' },
                      { value: -1000, label: '-1 s' },
                      { value: 0, label: '0 s' },
                      { value: 1000, label: '+1 s' },
                      { value: 2000, label: '+2 s' },
                    ]}
                  />
                </Box>
              </>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export const SettingButton: FC = () => {
  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="inherit" onClick={onClick} size="large">
        <SettingsIcon />
      </IconButton>
      <SettingModal
        open={open}
        onClose={onClose}
        key={Number(open)} // 表示/非表示時に再レンダリング
      />
    </>
  );
};
