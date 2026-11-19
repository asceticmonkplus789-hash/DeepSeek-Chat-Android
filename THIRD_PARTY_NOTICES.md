# 上游、素材与第三方说明

## 网页源码

本项目基于 DeepSeek 官方 chat-demo v0.1.1，使用 React、TypeScript、rspack、zustand 等依赖，并添加 Capacitor 安卓封装和手机界面适配。

- 上游仓库 https://github.com/deepseek-ai/chat-demo
- 上游源码版本 https://github.com/deepseek-ai/chat-demo/tree/v0.1.1
- 上游 MIT 许可和版权文本保留于本仓库 [LICENSE](LICENSE)

## Harness 图标与冷启动形状

素材固定来源提交为 `2e39e70496aa02986ca6a820c5d497e816b69d7e`。

- 桌面图标 https://github.com/deepseek-ai/deepseek-harness/blob/2e39e70496aa02986ca6a820c5d497e816b69d7e/apps/desktop/resources/icon.png
- 冷启动矢量形状 https://github.com/deepseek-ai/deepseek-harness/blob/2e39e70496aa02986ca6a820c5d497e816b69d7e/apps/web/public/favicon.svg
- 品牌说明 https://github.com/deepseek-ai/deepseek-harness/blob/2e39e70496aa02986ca6a820c5d497e816b69d7e/BRAND_GUIDELINES.zh.md

本仓库为个人安卓适配项目。引用品牌素材用于说明外观来源，维护者未声明获得官方背书或合作授权。素材处理记录见 [桌面素材说明](android-wrap/assets/SOURCE.md) 和 [冷启动资源说明](android-wrap/native-res/SOURCE.md)。

## 依赖及分发

网页依赖由 `package.json` 和 `pnpm-lock.yaml` 记录。安卓封装依赖由 `android-wrap/package.json` 和相应锁文件记录，原生依赖由 Capacitor 生成的 Gradle 工程引入。

React、Capacitor、KaTeX、Mermaid、Prism、idb、fflate 和其他依赖遵循各自许可证。具体版本与许可文本应以实际安装和分发的包为准。本文记录主要来源，尚未完成所有传递依赖的许可证清单审计。

网页构建会复制 `LICENSE` 至 `dist/LICENSE`，安卓同步时将其带入 APK 的网页资源中。分发源码、网页包或 APK 时保留上游许可，并核对实际打包的第三方组件要求。
