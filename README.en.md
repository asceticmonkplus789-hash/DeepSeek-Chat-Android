# DeepSeek Chat · Android

[简体中文](README.md) | English

An Android adaptation of [DeepSeek's chat-demo](https://github.com/deepseek-ai/chat-demo) v0.1.1, using React, TypeScript and Capacitor 6. The app connects directly to the configured API service. Users enter their own API key in Settings.

The development branch is `ui-optimize`. The app name is **DeepSeek Chat**, with application ID `com.example.chatdemo`. Current APKs are debug-signed sideload builds.

## Android changes

- Classic interface with light, dark and system theme options.
- Android back handling, status bar synchronization and vibration feedback.
- Drawer, message and dialog transitions with reduced-motion support.
- Visible historical message actions on touch devices.
- Harness-style launcher icon and a white launch screen with a centered whale and no title bar.

On November 19, 2026, commit `7dc302a` passed the cloud APK build, and the user confirmed that the reported cold-start display issue was resolved. Other device and feature coverage is documented separately in the [changelog](CHANGELOG.md).

## Download and install

Open [Build Android APK](https://github.com/asceticmonkplus789-hash/chat-demo-android/actions/workflows/build-apk.yml), select a successful run for the intended commit, download the `chatdemo-debug-apk` artifact, and extract `app-debug.apk`. Transfer it to Android and allow installation from the relevant source when prompted. Artifact downloads generally require GitHub sign-in. Availability follows the retention shown on GitHub.

**Back up before updating.** The workflow has no persistent signing key, and the delivered builds have different signing certificates. Android generally rejects an in-place update with a different certificate. Export conversations and separately save the API key, settings and important original attachments before deciding to uninstall. Uninstalling clears local app data.

## Usage and data

Enter your API key under Settings → Data. Requests use that key and may incur charges from the configured API service.

The source includes conversations and branches, streaming replies, thinking, search, attachments, speech input and read-aloud, Markdown, KaTeX and Mermaid. Search, file and speech capabilities depend on the API service and need separate verification.

The API key and settings use localStorage. Conversations and original attachments use IndexedDB. Requests send relevant content to the configured service. History export includes conversations and locally available original images, while API keys, settings and original non-image attachments require separate backups. Import replaces local conversations and attachments after confirmation and validation. See [data notes](docs/DATA.md) and the [archive format](src/services/chat/history/README.md), both in Chinese.

## Development

The verified local toolchain is Node.js 24.21.0 with pnpm 9.15.9. The current workflow uses Node.js 20, pnpm 9 and JDK 17.

```sh
git clone --branch ui-optimize https://github.com/asceticmonkplus789-hash/chat-demo-android.git
cd chat-demo-android
npx pnpm@9.15.9 install --frozen-lockfile
npx pnpm@9.15.9 dev
```

Open http://localhost:8090. See [development and build instructions](docs/DEVELOPMENT.md) for Windows commands, APK builds and the launch-theme patch sequence.

The `main` branch preserves the initial static-package implementation. The repository's `v0.1.1` tag preserves the initial Android archive and is distinct from the upstream source tag of the same name.

## Documentation and attribution

- [Development and builds](docs/DEVELOPMENT.md)
- [Data handling and issue reports](docs/DATA.md)
- [Changelog and verification scope](CHANGELOG.md)
- [Upstream and asset notices](THIRD_PARTY_NOTICES.md)

This is a personal Android adaptation. The web source comes from DeepSeek chat-demo, and the visual assets reference DeepSeek Harness. The original [MIT license](LICENSE) and copyright notice are preserved. Include applicable license notices when distributing the app.
