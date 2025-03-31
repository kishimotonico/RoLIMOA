import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ConnectedDevice = {
  deviceName: string;
  sockId: string;
  currentPath: string;
};

type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<T>; // T型からK以外のプロパティをPartialにする
type PartialConnectedDevice = PartialExcept<ConnectedDevice, 'sockId'>;

const initialState: ConnectedDevice[] = [];

export const connectedDevicesStateSlice = createSlice({
  name: 'connectedDevices',
  initialState,
  reducers: {
    setState: (_, action: PayloadAction<ConnectedDevice[]>) => action.payload,
    // デバイスの追加もしくは更新
    addDeviceOrUpdate: (cur, action: PayloadAction<PartialConnectedDevice>) => {
      const i = cur.findIndex(
        (device) => device.sockId === action.payload.sockId,
      );
      if (i === -1) {
        // 既存デバイスがないときはデバイスを新規追加
        cur.push({
          deviceName: '',
          currentPath: '',
          ...action.payload,
        });
      } else {
        // 既存のデバイスがあるときは各プロパティを上書き
        cur[i] = {
          ...cur[i],
          ...action.payload,
        };
      }
    },
    // デバイスの削除（サーバ側でdispatch）
    removeDevice: (cur, action: PayloadAction<{ sockId: string }>) => {
      return cur.filter((device) => device.sockId !== action.payload.sockId);
    },
  },
});
