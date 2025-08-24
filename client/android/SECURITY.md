# Android Security Configuration

## Production Keystore

This project uses a production keystore for signing release builds.

### Keystore Location
- File: `app/release.keystore`
- Configuration: `gradle.properties`

### Important Security Notes

1. **Never commit your production keystore or real passwords to version control**
2. **Store keystore and passwords securely** - if lost, you cannot update your app
3. **Change default passwords** in `gradle.properties` before production use
4. **Make secure backups** of your keystore file

### Release Build Features

- **Code Obfuscation**: ProGuard/R8 enabled for release builds
- **Resource Shrinking**: Unused resources removed automatically
- **Production Signing**: Uses production keystore (not debug keystore)
- **Optimized ProGuard**: Uses `proguard-android-optimize.txt` for better optimization

### Generate New Keystore

To generate a new production keystore:

```bash
# Using the helper script
node scripts/generate-keystore.js

# Or manually with keytool
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore \
  -alias release-key -keyalg RSA -keysize 2048 -validity 10000
```

### Build Release APK

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be generated in `app/build/outputs/apk/release/`