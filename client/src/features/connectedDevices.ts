import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ConnectedDevice = {
  deviceName: string,
  sockId: string,
};

const initialState: ConnectedDevice[] = [];

export const connectedDevicesStateSlice = createSlice({
  name: 'connectedDevices',
  initialState,
  reducers: {
    setCurrent: (_, action: PayloadAction<ConnectedDevice[]>) => action.payload,
    // デバイスの追加およびデバイス名の更新
    addDevice: (cur, action: PayloadAction<ConnectedDevice>) => {
      const exclude = cur.filter(device => device.sockId !== action.payload.sockId);
      return [...exclude, action.payload];
    },
    // デバイスの削除（サーバ側でdispatch）
    removeDevice: (cur, action: PayloadAction<{ sockId: string }>) => {
      return cur.filter(device => device.sockId !== action.payload.sockId);
    },
  },
});
