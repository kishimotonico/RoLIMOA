import { FC, useCallback, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { LyricalSocket } from '@/lyricalSocket';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { connectedDevicesStateSlice } from '@/slices/connectedDevices';
import { useDispatch } from 'react-redux';
import { getSetting, setSetting } from '@/util/clientStoredSetting';

type FormValues = {
  deviceName: string,
};

type SettingModalProps = {
  open: boolean,
  onClose: () => void,
};

export const SettingModal: FC<SettingModalProps> = ({
  open,
  onClose,
}) => {
  const savedSetting = getSetting();
  const dispatch = useDispatch();
  const prevDeviceName = useRef<string>(savedSetting.deviceName);

  const { control, handleSubmit } = useForm({
    reValidateMode: "onChange",
    defaultValues: savedSetting,
  });

  const onSubmit: SubmitHandler<FormValues> = useCallback((form) => {
    if (! form) {
      return;
    }

    setSetting(form);

    // デバイス名の変更時は、Reduxのストアも反映
    if (form.deviceName !== prevDeviceName.current) {
      prevDeviceName.current = form.deviceName;

      const action = connectedDevicesStateSlice.actions.addDeviceOrUpdate({
        sockId: LyricalSocket.instance.socket.id,
        deviceName: form.deviceName,
      });
      LyricalSocket.dispatch(action, dispatch);
    }

    onClose();
  }, [onClose, dispatch]);

  const closeHandler = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <Dialog aria-labelledby="setting-modal-title" open={open} onClose={closeHandler} fullWidth>
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
              <TextField
                {...field}
                label="ユーザ・デバイス名"
                helperText='担当がある場合、"篝ノ霧枝@青コート点数"みたいな名前を推奨'
                fullWidth
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler}>
          OK
        </Button>
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

  return <>
    <IconButton color="inherit" onClick={onClick} size="large">
      <SettingsIcon />
    </IconButton>
    <SettingModal open={open} onClose={onClose} />
  </>;
}
