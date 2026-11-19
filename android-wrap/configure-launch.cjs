// Apply after capacitor-assets so generated Android projects use a white launch theme.
const fs = require('node:fs')
const path = require('node:path')

const root = __dirname
const config = JSON.parse(fs.readFileSync(path.join(root, 'capacitor.config.json'), 'utf8'))
const main = path.join(root, 'android', 'app', 'src', 'main')
const stylesPath = path.join(main, 'res', 'values', 'styles.xml')
const activityPath = path.join(main, 'java', ...config.appId.split('.'), 'MainActivity.java')
const source = fs.readFileSync(stylesPath, 'utf8')
const launchStyle = /<style name="AppTheme\.NoActionBarLaunch"[^>]*>[\s\S]*?<\/style>/g
const matches = source.match(launchStyle)
if (matches?.length !== 1) {
  throw new Error('Expected exactly one Capacitor launch theme')
}

const activity = `package ${config.appId};

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
    }
}
`
const originalActivity = fs.readFileSync(activityPath, 'utf8')
if (!/public class MainActivity extends BridgeActivity\s*\{\s*\}/.test(originalActivity) && originalActivity !== activity) {
  throw new Error('MainActivity has custom code; refusing to replace it')
}

const theme = `<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">#ffffff</item>
        <item name="windowSplashScreenAnimatedIcon">@drawable/launch_whale</item>
        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
        <item name="android:windowNoTitle">true</item>
        <item name="windowActionBar">false</item>
        <item name="android:statusBarColor">#ffffff</item>
        <item name="android:navigationBarColor">#ffffff</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
    </style>`

const drawableDir = path.join(main, 'res', 'drawable')
fs.mkdirSync(drawableDir, { recursive: true })
fs.copyFileSync(path.join(root, 'native-res', 'launch_whale.xml'), path.join(drawableDir, 'launch_whale.xml'))
fs.writeFileSync(stylesPath, source.replace(launchStyle, theme))
fs.writeFileSync(activityPath, activity)
console.log('Configured white splash, centered whale and title-free activity handoff')
