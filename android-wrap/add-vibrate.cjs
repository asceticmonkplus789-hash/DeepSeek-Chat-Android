// 给生成的 Android 工程补上 VIBRATE 权限（触感反馈需要），幂等。
const fs = require('fs')
const path = require('path')

const manifestPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'AndroidManifest.xml')
const source = fs.readFileSync(manifestPath, 'utf8')
if (source.includes('android.permission.VIBRATE')) {
  console.log('VIBRATE permission already present')
  process.exit(0)
}
const next = source.replace(
  '<application',
  '    <uses-permission android:name="android.permission.VIBRATE" />\n    <application'
)
if (next === source) {
  console.error('Could not locate <application> tag in AndroidManifest.xml')
  process.exit(1)
}
fs.writeFileSync(manifestPath, next)
console.log('VIBRATE permission added')
