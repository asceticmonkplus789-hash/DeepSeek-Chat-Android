# 冷启动鲸鱼资源

冷启动使用 Harness 仓库的矢量鲸鱼形状，以透明边缘配合系统纯白背景显示。

源文件 https://github.com/deepseek-ai/deepseek-harness/blob/2e39e70496aa02986ca6a820c5d497e816b69d7e/apps/web/public/favicon.svg

`launch_whale.xml` 沿用 SVG path，改用深灰色 `#30343c`。288dp 画布内图形按 0.6 缩放，预留 Android 启动图标安全区。应用桌面图标仍使用 assets 内的 Harness 桌面原图。

`configure-launch.cjs` 在资源生成后复制该矢量文件并配置启动主题。启动背景、状态栏和导航栏使用纯白色。启动主题设置 `postSplashScreenTheme`，MainActivity 在 super.onCreate 前安装 AndroidX SplashScreen，使应用接管时使用无标题栏主题。

不将大幅位图设置为通用 `android:background`，避免标题区域与控件复用背景图导致拉伸。API 23+ 的兼容启动图由 Theme.SplashScreen 自身绘制，保留其默认 windowBackground。
