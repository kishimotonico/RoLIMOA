import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, IconButton, Badge, DialogContent, DialogContentText, TextField, DialogActions, Button, withStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { LyricalSocket } from './lyricalSocket';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { connectedDevicesStateSlice } from './features/connectedDevices';
import { useDispatch } from 'react-redux';

const LOCAL_STORAGE_KEY = "deviceName";
const defaultDeviceName = "anonymous@役割なし";
export function GetDeviceName(): string {
  return localStorage.getItem(LOCAL_STORAGE_KEY) ?? defaultDeviceName;
}
export function SetDeviceName(deviceName: string) {
  localStorage.setItem(LOCAL_STORAGE_KEY, deviceName);
}

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
  const dispatch = useDispatch();
  const prevDeviceName = useRef<string | null>(null);
  const savedDeviceName = GetDeviceName();

  // useEffect しない簡略化　
  useEffect(() => {
    if (savedDeviceName) {
      prevDeviceName.current = savedDeviceName;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { control, handleSubmit } = useForm({
    reValidateMode: "onChange",
    defaultValues: {
      deviceName: savedDeviceName,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = useCallback((form) => {
    if (! form) {
      return;
    }
    if (form.deviceName !== prevDeviceName.current) {
      // デバイス名の変更をlocalStorageに保存
      SetDeviceName(form.deviceName);
      prevDeviceName.current = form.deviceName;

      // Reduxのストアにデバイスの追加を反映
      // TODO: App.tsxとのコードの重複を解消
      const socket = LyricalSocket.instance.socket;
      const action = connectedDevicesStateSlice.actions.addDevice({
        sockId: socket.id,
        deviceName: GetDeviceName(),
      });
      dispatch(action)
      socket.emit("dispatch", action);
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
        <DialogContentText>
          適当に設定しておいてください。localStorageに保存します、たぶん。
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

const AnimationBadge = withStyles((theme) => ({
  '@keyframes breatheAnimation': {
    '0%': {
      transform: "scale(1.2) translate(50%, -50%);",
    },
    '20%': {
      transform: "scale(1.2) translate(50%, -50%);",
    },
    '50%': {
      transform: "scale(0.8) translate(50%, -50%);",
    },
    '80%': {
      transform: "scale(1.2) translate(50%, -50%);",
    },
    '100%': {
      transform: "scale(1.2) translate(50%, -50%);",
    },
  },
  badge: {
    animationName: "$breatheAnimation",
    animationDuration: "0.5s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },
  invisible: {
    display: "none",
  },
}))(Badge);

export const SettingButton: FC = () => {
  const [open, setOpen] = useState(false);
  const savedDeviceName = GetDeviceName();
  const invisibleeBadge = savedDeviceName ? savedDeviceName !== defaultDeviceName : false;

  const onClick = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="inherit" onClick={onClick}>
        <AnimationBadge color="secondary" badgeContent="!" invisible={invisibleeBadge}>
          <SettingsIcon />
        </AnimationBadge>
      </IconButton>
      <SettingModal open={open} onClose={onClose} />
    </>
  );
}
