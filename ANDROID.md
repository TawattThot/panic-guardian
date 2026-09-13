# Android (Capacitor) build

FOSS / F-Droid-friendly Capacitor wrapper. No Play Billing, no Google Play Services plugins.

## App identity

| Field | Value |
|-------|-------|
| Application ID | `com.tawattthot.panicguardian` |
| Name | Panic Guardian |
| versionName | `0.1.0` |
| versionCode | `1` |
| Capacitor | `6.2.0` |

## Safety (packaging must not change)

- Panic button → countdown → **cancel** or confirm-gated SOS
- Fall / impact starts the **same** countdown (cancelable)
- `sms:` / `tel:` intents only — OS still confirms
- **911 / emergency call only on explicit tap** — never silent auto-dial from sensors
- No gunpoint / threat-type detection, no inferred auto-police

## Prerequisites

- Node 20+
- JDK 17+ (Java 21 works)
- Android SDK with `compileSdk` / API 34 (`ANDROID_HOME` or `android/local.properties` → `sdk.dir=...`)

## Build

```bash
npm ci
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`

Release (unsigned):

```bash
cd android && ./gradlew assembleRelease
```

APK: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Permissions / features

- **Required hardware:** `android.hardware.sensor.accelerometer` (fall / impact via WebView `DeviceMotion`)
- **INTERNET:** optional https only; SOS does not use the network
- No GMS / Play Billing

## Related

Sibling app packaging: [punch-speed-meter](https://github.com/TawattThot/punch-speed-meter)
