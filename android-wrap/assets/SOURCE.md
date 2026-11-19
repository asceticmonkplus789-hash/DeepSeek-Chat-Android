# 图标与启动屏素材来源

2026-11-19 按用户指定的 DeepSeek Harness 项目参考更新。

原图使用 DeepSeek Harness 桌面应用资源，固定到仓库提交 `2e39e70496aa02986ca6a820c5d497e816b69d7e`。

- 仓库 https://github.com/deepseek-ai/deepseek-harness
- 原文件 https://github.com/deepseek-ai/deepseek-harness/blob/2e39e70496aa02986ca6a820c5d497e816b69d7e/apps/desktop/resources/icon.png
- 品牌说明 https://github.com/deepseek-ai/deepseek-harness/blob/2e39e70496aa02986ca6a820c5d497e816b69d7e/BRAND_GUIDELINES.zh.md

原图为 1104×1104 PNG。保留原图鲸鱼造型、色调与底板，缩放为 1024×1024 的 `icon.png`。启动屏将图标正确缩放为 800×800，再居中放入 2732×2732 画布，亮色背景为 `#ffffff`，暗色背景为 `#151517`。

安卓多密度资源由现有 Capacitor assets 流程生成。应用内“正在加载对话”的页面仍使用原有加载状态，当前改动针对安卓冷启动资源。安卓系统实际显示效果需通过安装 APK 确认。

2026-11-19 后续更新：上述 splash 位图记录的是最初资源生成方式。自 `7dc302a` 起，生成资源后会执行 `configure-launch.cjs`，实际启动主题使用纯白背景与独立矢量鲸鱼，形状来源见 [冷启动资源说明](../native-res/SOURCE.md)。使用者已反馈该版本冷启动显示问题解决。
