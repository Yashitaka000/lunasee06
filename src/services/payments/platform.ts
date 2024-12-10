import { Platform } from '@nativescript/core';

export const isNativeScript = () => {
  try {
    return !!Platform.isIOS || !!Platform.isAndroid;
  } catch {
    return false;
  }
};

export const isMockPayments = () => !isNativeScript();