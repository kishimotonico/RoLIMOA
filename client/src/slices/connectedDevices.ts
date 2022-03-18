import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';

export type ConnectedDevice = {
  deviceName: string,
  sockId: string,
  currentPath?: string,
};

const initialState: ConnectedDevice[] = [];

export const connectedDevicesStateSlice = createSlice({
  name: 'connectedDevices',
  initialState,
  reducers: {
    setCurrent: (_, action: PayloadAction<ConnectedDevice[]>) => action.payload,
    // デバイスの追加およびデバイス名の更新
    addDevice: (cur, action: PayloadAction<ConnectedDevice>) => {
      addDeviceToArray(cur, action.payload);
    },
    // デバイスがアクセスしているページのパスを更新
    updatePath: (cur, action: PayloadAction<{ sockId: string, currentPath: string }>) => {
      const existing = cur.find(device => device.sockId === action.payload.sockId);
      // 既存のデバイスのcurrentPathを変更
      if (existing) {
        existing.currentPath = action.payload.currentPath;
      }
      // 既存のデバイスがないので、新規追加
      else {
        const newDevice: ConnectedDevice = {
          deviceName: "",
          ...action.payload,
        };
        addDeviceToArray(cur, newDevice);
      }
    },
    // デバイスの削除（サーバ側でdispatch）
    removeDevice: (cur, action: PayloadAction<{ sockId: string }>) => {
      return cur.filter(device => device.sockId !== action.payload.sockId);
    },    
  },
});

// 現在のデバイスに追加する
function addDeviceToArray(currents: WritableDraft<ConnectedDevice>[], newDevice: ConnectedDevice): void {
  const existing = currents.find(device => device.sockId === newDevice.sockId);
  if (existing) {
    // 既存のデバイスがあるときはデバイス名を更新
    existing.deviceName = newDevice.deviceName;
  } else {
    // 既存デバイスがないときはデバイスを新規追加
    currents.push(newDevice);
  }
}
