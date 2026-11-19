# 开发与构建

## 分支与开发环境

日常源码位于 `ui-optimize`。`main` 和 `v0.1.1` 保留初版归档。

本地已验证 Node.js 24.21.0、pnpm 9.15.9。现有 GitHub Actions 使用 Node.js 20、pnpm 9、JDK 17。网页使用 React 18、TypeScript、rspack 2 和 zustand，安卓使用 Capacitor 6。

```sh
npx pnpm@9.15.9 install --frozen-lockfile
npx pnpm@9.15.9 dev
```

开发地址为 http://localhost:8090 。API 地址由 `rspack.config.ts` 中的 `createConfig` 配置，默认 `https://api.deepseek.com`。API Key 在运行时输入。

## 网页检查与构建

```sh
npx pnpm@9.15.9 type
npx pnpm@9.15.9 lint
```

类型检查是已有的验证步骤。lint 命令来自仓库脚本，本次文档整理没有重跑 lint，也不据此声明全仓 lint 无错误。

Linux 或 Git Bash 构建命令为：

```sh
npx pnpm@9.15.9 build
```

Windows PowerShell 使用：

```powershell
$env:NODE_ENV = 'production'
npx pnpm@9.15.9 exec rspack build -c rspack.config.ts
```

`pnpm build` 包含 `rm -rf dist`，PowerShell 不直接执行该脚本。两种方式的产物均位于 `dist/`，rspack 的 `output.clean` 会清理该目录中的旧产物。需保留的版本先归档到构建目录之外，并遵守工作环境关于文件删除的确认规则。

新增或变更网页依赖时，同步更新 `pnpm-lock.yaml`，因为 CI 使用 frozen lockfile。格式化脚本会写入文件，应先确认格式化范围。

## APK 云端流水线

配置见 [.github/workflows/build-apk.yml](../.github/workflows/build-apk.yml)。push 至 `ui-optimize`、`main`、`master` 或手动触发均会运行。当前文档提交也会触发完整 APK 构建。

执行顺序如下。

1. 安装网页依赖并构建 `dist/`。
2. 在 `android-wrap` 安装封装依赖。
3. `cap add android` 生成安卓工程，再 `cap sync android` 同步网页与插件。
4. `add-vibrate.cjs` 添加震动权限。
5. Capacitor assets 生成图标与启动屏资源。
6. `configure-launch.cjs` 应用纯白冷启动主题、矢量鲸鱼和 Activity 主题切换。
7. 配置 SDK，执行 Gradle `assembleDebug`。
8. 上传 `chatdemo-debug-apk` artifact。

`android-wrap/android/` 为生成目录，受 Git 忽略。修改该目录的结果会在下次生成时丢失，应将需要保留的修改写入受跟踪的资源或补丁脚本。

## 本地安卓构建

本机项目采用云端构建，本地原生编译需另行准备 JDK 17 和兼容的 Android SDK。下面的流程供已有安卓开发环境使用，本次未验证本地 Gradle 编译。

先完成网页构建，再进入 `android-wrap`：

```sh
npm install --no-package-lock
npx cap add android
npx cap sync android
node add-vibrate.cjs
npx capacitor-assets generate --android --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#ffffff' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#151517'
node configure-launch.cjs
```

`cap add android` 用于尚无生成工程的情况。已有工程时先检查现状，再决定是否只同步。为 Gradle 配置 SDK 路径后，在 `android-wrap/android` 执行 Windows 的 `gradlew.bat assembleDebug` 或 Linux 的 `./gradlew assembleDebug`。产物位于 `app/build/outputs/apk/debug/app-debug.apk`。

当前封装目录有 `package-lock.json`，但 CI 仍使用 `npm install --no-package-lock`。不要把现有流水线描述为完全锁定的安卓依赖构建。切换到 `npm ci` 或升级 Capacitor 应作为独立改动验证。

## 图标与冷启动

桌面图标来源见 [assets/SOURCE.md](../android-wrap/assets/SOURCE.md)，冷启动形状来源见 [native-res/SOURCE.md](../android-wrap/native-res/SOURCE.md)。

assets 内仍保留旧式亮暗启动屏位图，生成器会处理它们。当前实际启动主题由随后执行的 `configure-launch.cjs` 接管，使用 `launch_whale.xml`、纯白背景和无标题栏过渡。该步骤须放在素材生成之后。

`configure-launch.cjs` 检查生成模板，只替换预期的启动样式和空白 MainActivity 模板，避免覆盖额外原生代码。未来生成模板变化后应检查其匹配条件。

## 服务接口与功能验收

聊天使用源码中的 Anthropic 兼容 Messages / Files API，语音使用 `/v1/tools/asr` 和 `/v1/tools/tts`。搜索、链接阅读、自动标题等请求包含服务扩展。切换 API 地址时应逐项检查协议兼容性。

按本次改动选择验收范围，分别记录类型检查、网页构建、APK 构建、手机安装、手机交互及真实 API 测试结果。冷启动测试需完全结束应用后重新打开，并检查系统浅色与深色模式。返回键顺序为设置、抽屉、搜索面板、退出。

提交前检查差异和锁文件。需要远程推送或发布时遵循维护者当轮授权。debug APK 的签名尚未固定，手机更新和备份事项见 [数据说明](DATA.md)。
