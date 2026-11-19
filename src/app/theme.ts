import { useSyncExternalStore } from 'react'
import { StatusBar, Style } from '@capacitor/status-bar'
import { isNative } from '../services/capacitor.js'
import { useSettings, type ThemePreference, type UiStyle } from '../services/settings.js'

export type Theme = 'light' | 'dark'

const query = window.matchMedia('(prefers-color-scheme: dark)')

const subscribeOsTheme = (listener: () => void) => {
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}

const getOsTheme = (): Theme => (query.matches ? 'dark' : 'light')

const resolveTheme = (preference: ThemePreference, osTheme: Theme): Theme =>
  preference === 'system' ? osTheme : preference

/** 当前实际生效的深浅色：手动选择优先，「跟随系统」时取系统设置 */
export const useTheme = (): Theme => {
  const preference = useSettings((state) => state.themePreference)
  const osTheme = useSyncExternalStore(subscribeOsTheme, getOsTheme)
  return resolveTheme(preference, osTheme)
}

const syncPageBackground = () => {
  const backgroundColor = getComputedStyle(document.body).backgroundColor
  document.documentElement.style.backgroundColor = backgroundColor
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', backgroundColor)
}

/** rgb(r, g, b) → #rrggbb，供状态栏插件使用 */
const toHex = (rgb: string): string => {
  const match = /rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/.exec(rgb)
  if (!match) {
    return '#ffffff'
  }
  return `#${[match[1], match[2], match[3]]
    .map((value) => Number(value).toString(16).padStart(2, '0'))
    .join('')}`
}

/** 原生壳内同步状态栏图标颜色与背景色 */
const syncStatusBar = (theme: Theme) => {
  if (!isNative()) {
    return
  }
  try {
    void StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light })
    void StatusBar.setBackgroundColor({ color: toHex(getComputedStyle(document.body).backgroundColor) })
  } catch {
    // 插件未就绪时忽略，下次主题变化会重试
  }
}

/**
 * 在短窗口内让全页颜色平滑过渡，再恢复各组件的常规过渡。
 * 主题与界面风格切换共用，避免生硬跳变。
 */
const withColorTransition = (apply: () => void) => {
  const body = document.body
  body.classList.add('change-theme')
  apply()
  window.setTimeout(() => {
    body.classList.remove('change-theme')
  }, 320)
}

/** 同步页面主题、根画布背景、状态栏和 theme-color。 */
const applyTheme = (theme: Theme) => {
  withColorTransition(() => {
    const body = document.body
    body.classList.toggle('dark', theme === 'dark')
    body.classList.toggle('light', theme === 'light')
    if (theme === 'dark') {
      body.setAttribute('data-ds-dark-theme', 'dark')
    } else {
      body.removeAttribute('data-ds-dark-theme')
    }
    document.documentElement.style.colorScheme = theme
    // 首次背景色同步在样式表加载完成后执行，适配 WebKit 的 defer 脚本执行顺序。
    if (document.readyState === 'complete') {
      syncPageBackground()
    }
  })
  syncStatusBar(theme)
}

/** 应用界面风格（官方简洁 / 现代活泼），以 data 属性驱动 CSS 变量覆盖。 */
const applyUiStyle = (uiStyle: UiStyle) => {
  withColorTransition(() => {
    if (uiStyle === 'lively') {
      document.body.setAttribute('data-ds-ui-style', 'lively')
    } else {
      document.body.removeAttribute('data-ds-ui-style')
    }
  })
}

let appliedTheme: Theme | null = null
let appliedUiStyle: UiStyle | null = null

const syncTheme = () => {
  const theme = resolveTheme(useSettings.getState().themePreference, getOsTheme())
  if (theme !== appliedTheme) {
    appliedTheme = theme
    applyTheme(theme)
  }
}

const syncUiStyle = () => {
  const uiStyle = useSettings.getState().uiStyle
  if (uiStyle !== appliedUiStyle) {
    appliedUiStyle = uiStyle
    applyUiStyle(uiStyle)
  }
}

/** 首屏渲染前同步应用一次，之后随主题与风格设置及系统深浅色变化更新 */
export const setupTheme = () => {
  syncTheme()
  syncUiStyle()
  if (document.readyState !== 'complete') {
    window.addEventListener(
      'load',
      () => {
        syncPageBackground()
        syncStatusBar(appliedTheme ?? getOsTheme())
      },
      { once: true }
    )
  }
  query.addEventListener('change', syncTheme)
  useSettings.subscribe(() => {
    syncTheme()
    syncUiStyle()
  })
}
