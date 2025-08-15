# Capacitor Integration Guide

This SDK is now fully compatible with [Capacitor](https://capacitorjs.com/) and provides enhanced device information when used in Capacitor environments.

## Installation

### 1. Install the SDK

```bash
npm install @geeklab.app/audiencelab-react-web-sdk
```

### 2. Install Capacitor (if not already installed)

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

### 3. Add Capacitor Device Plugin (Optional but Recommended)

For enhanced device information, install the Capacitor Device plugin:

```bash
npm install @capacitor/device
npx cap sync
```

**Note**: The SDK will work without Capacitor plugins installed, but will provide enhanced device information when they are available.

## Usage

### Basic Integration

```typescript
import { initializeAudiencelab } from "@geeklab.app/audiencelab-react-web-sdk";

// Initialize the SDK
const initSDK = async () => {
  try {
    const result = await initializeAudiencelab("your-api-key");
    console.log("SDK initialized:", result);
  } catch (error) {
    console.error("SDK initialization failed:", error);
  }
};
```

### Enhanced Device Information with Capacitor

When used in a Capacitor environment, the SDK automatically detects and uses Capacitor's native device APIs for more accurate information:

- **Device Name**: Uses Capacitor's device info when available
- **Device Model**: More accurate model detection on mobile devices
- **OS Version**: Native OS version information
- **Battery Level**: Uses Capacitor's battery API when available
- **Network Information**: Enhanced network detection

## Capacitor-Specific Features

### Automatic Detection

The SDK automatically detects if it's running in a Capacitor environment and adjusts its behavior accordingly:

```typescript
import {
  isCapacitorEnvironment,
  getCapacitorDeviceInfo,
} from "@geeklab.app/audiencelab-react-web-sdk";

if (isCapacitorEnvironment()) {
  const deviceInfo = await getCapacitorDeviceInfo();
  console.log("Device info:", deviceInfo);
}
```

### Fallback Behavior

The SDK gracefully falls back to web APIs when Capacitor plugins are not available:

1. **Battery Detection**: Falls back to Web Battery API or network-based detection
2. **Device Info**: Falls back to user agent parsing
3. **GPU Detection**: Falls back to basic WebGL information
4. **Font Detection**: Gracefully handles font detection failures

## Platform-Specific Considerations

### iOS

- Battery information may be limited due to iOS restrictions
- Device model detection works well with Capacitor Device plugin
- WebGL support is generally good

### Android

- Full access to device information through Capacitor
- Battery level detection works reliably
- GPU information may vary by device

### Web (PWA)

- Uses standard web APIs
- No Capacitor-specific features
- Still provides comprehensive device metrics

## Troubleshooting

### Common Issues

1. **Capacitor plugins not loading**

   - Ensure `@capacitor/device` is installed
   - Run `npx cap sync` after installation
   - Check that the app is running in a Capacitor environment
   - The SDK will work without plugins, just with reduced functionality

2. **Battery information not available**

   - This is normal on some platforms due to privacy restrictions
   - The SDK will fall back to alternative detection methods

3. **Device metrics showing "Unknown"**
   - Check if running in a Capacitor environment
   - Ensure Capacitor Device plugin is installed
   - Verify app permissions on mobile devices

### Debug Mode

Use the debug console to see what device information is being collected:

```typescript
import { DebugConsole } from "@geeklab.app/audiencelab-react-web-sdk";

// Add to your React component
<DebugConsole />;
```

## Migration from Previous Versions

If you're upgrading from a previous version:

1. The SDK is backward compatible
2. No changes required to existing code
3. Capacitor features are automatically enabled when available
4. All existing APIs continue to work as before

## Best Practices

1. **Install Capacitor Device Plugin**: For the best device information
2. **Handle Errors Gracefully**: The SDK provides fallbacks, but always handle potential errors
3. **Test on Multiple Platforms**: Verify behavior on iOS, Android, and web
4. **Use Debug Console**: During development to verify data collection

## Support

For issues specific to Capacitor integration:

1. Check the [Capacitor documentation](https://capacitorjs.com/docs)
2. Verify plugin installation and permissions
3. Test in both Capacitor and web environments
4. Use the debug console to identify issues

## Example Project

See the main README for a complete example of integrating the SDK with Capacitor in a React application.
