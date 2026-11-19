import { Capacitor } from '@capacitor/core'

/** 是否运行在 Capacitor 原生壳（Android APK / iOS）里 */
export const isNative = (): boolean => Capacitor.isNativePlatform()
