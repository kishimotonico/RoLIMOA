import { z } from 'zod';

const LOCAL_STORAGE_KEY = "RoLIMOA-setting";

const settingSchema = z.object({
  deviceName: z.string(),
});

type SettingType = z.infer<typeof settingSchema>;

const defaultValues: Required<SettingType> = {
  deviceName: "ななし＠役割なし",
};

export function getSetting(): SettingType {
  const rawSetting = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (! rawSetting) {
    return defaultValues;
  }

  const parseResult = settingSchema.partial().safeParse(JSON.parse(rawSetting));
  if (! parseResult.success) {
    console.warn("ふぇぇ…LocalStorageの設定が壊れているので、デフォルト値を使います");
    return defaultValues;
  }

  return {
    ...defaultValues,
    ...parseResult.data,
  };
}

export function setSetting(partialSetting: SettingType): void {
  const setting = { ...getSetting(), ...partialSetting };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(setting));
}
