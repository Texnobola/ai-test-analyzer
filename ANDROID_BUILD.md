# DTM Analyzer - Android App

## Build Instructions

### Prerequisites
1. Install Android Studio: https://developer.android.com/studio
2. Install Java JDK 17 or higher
3. Set ANDROID_HOME environment variable

### Build Steps

1. **Build the web app:**
   ```bash
   npm run build
   ```

2. **Sync with Android:**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```
   OR use the shortcut:
   ```bash
   npm run android
   ```

4. **In Android Studio:**
   - Wait for Gradle sync to complete
   - Click "Run" button or press Shift+F10
   - Select your device/emulator

### Splash Screen
- Configured with 3-second duration
- Gradient purple background (#667eea to #764ba2)
- Smooth fade-out animation (500ms)
- Full-screen immersive mode

### App Features
- ✅ Native Android app
- ✅ Animated splash screen
- ✅ Offline capable
- ✅ Camera access for test scanning
- ✅ Responsive design
- ✅ Professional UI

### Generate APK
In Android Studio:
1. Build > Build Bundle(s) / APK(s) > Build APK(s)
2. APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

### Generate Signed APK (for release)
1. Build > Generate Signed Bundle / APK
2. Follow the wizard to create/use keystore
3. APK will be in: `android/app/release/`
