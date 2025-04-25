
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

export const isNativePlatform = async () => {
  const info = await Device.getInfo();
  return info.platform !== 'web' || Capacitor.isNativePlatform();
};
