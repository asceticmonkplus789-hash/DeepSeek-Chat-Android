/** 轻触感反馈：Android 震动，不支持的平台静默忽略 */
export const haptic = (duration = 12): void => {
  try {
    navigator.vibrate?.(duration)
  } catch {
    // 不支持或未授权时忽略
  }
}
