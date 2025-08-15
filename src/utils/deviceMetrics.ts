import { getDPI } from "./metrics/getDpi";
import { fetchGpuInfo } from "./metrics/getGpuData";
import { getScreenSize } from "./metrics/getScreenSize";
import { getInstalledFonts } from "./metrics/getInstalledFonts";
import { getBatteryLevel } from "./metrics/getBatteryLevel";
import { getTimezone } from "./metrics/getTimezone";
import { FONTLIST } from "./metrics/fontList";
import { getCapacitorDeviceInfo, isCapacitorEnvironment } from "./capacitorCompatibility.js";

export const getDeviceMetrics = async () => {
  try {
    const metrics: {
      deviceName?: string;
      deviceModel?: string;
      osVersion?: string;
      dpi?: number;
      gpuRenderer?: string;
      gpuVendor?: string;
      gpuVersion?: string;
      nativeWidth?: number;
      nativeHeight?: number;
      legacyWidth?: number;
      legacyHeight?: number;
      installedFonts?: string[];
      lowBatteryLevel?: boolean;
      timezone?: string;
    } = {};

    // Fetch dpi, gpu info object, screen size, timezone, installed fonts and battery level
    const results = await Promise.allSettled([
      getDPI(),
      fetchGpuInfo(),
      getScreenSize(),
      getTimezone(),
      getInstalledFonts(FONTLIST),
      getBatteryLevel(),
    ]);

    // DPI
    if (results[0].status === "fulfilled") metrics.dpi = results[0].value;

    // GPU
    if (results[1].status === "fulfilled") {
      metrics.gpuRenderer = results[1].value.renderer;
      metrics.gpuVendor = results[1].value.vendor;
      metrics.gpuVersion = results[1].value.version;
    }

    // Screen size
    if (results[2].status === "fulfilled") {
      metrics.legacyWidth = results[2].value.width;
      metrics.legacyHeight = results[2].value.height;
      metrics.nativeWidth =
        results[2].value.width * (window.devicePixelRatio || 1);
      metrics.nativeHeight =
        results[2].value.height * (window.devicePixelRatio || 1);
    }

    // Get device info - try Capacitor first, then fallback to user agent parsing
    const userAgent = window.navigator.userAgent;
    const platform = navigator.platform || "Unknown";

    // Try to get Capacitor device info first
    const capacitorInfo = await getCapacitorDeviceInfo();
    const isCapacitor = isCapacitorEnvironment();

    let deviceName = platform;
    let deviceModel = "Unknown";
    let osVersion = "Unknown";

    // Use Capacitor info if available
    if (capacitorInfo.name || capacitorInfo.model || capacitorInfo.osVersion) {
      deviceName = capacitorInfo.name || deviceName;
      deviceModel = capacitorInfo.model || deviceModel;
      osVersion = capacitorInfo.osVersion || osVersion;
    } else {
      // Enhanced device detection for Capacitor environments
      if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        deviceName = "iOS";
        const match = userAgent.match(/OS (\d+_\d+)/);
        osVersion = match ? match[1].replace("_", ".") : "Unknown";
        deviceModel = userAgent.includes("iPhone") ? "iPhone" : "iPad";
      } else if (userAgent.includes("Android")) {
        deviceName = "Android";
        const match = userAgent.match(/Android (\d+\.\d+)/);
        osVersion = match ? match[1] : "Unknown";
        // Try to extract device model from user agent
        const modelMatch = userAgent.match(/\(Linux; U; Android [^;]+; ([^;]+)/);
        deviceModel = modelMatch ? modelMatch[1] : "Android Device";
      } else if (userAgent.includes("Windows")) {
        deviceName = "Windows";
        const match = userAgent.match(/Windows NT (\d+\.\d+)/);
        osVersion = match ? match[1] : "Unknown";
      } else if (userAgent.includes("Mac OS X")) {
        deviceName = "macOS";
        const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
        osVersion = match ? match[1].replace("_", ".") : "Unknown";
      } else if (userAgent.includes("Linux")) {
        deviceName = "Linux";
        osVersion = "Unknown";
      }
    }

    if (isCapacitor && !capacitorInfo.name) {
      // In Capacitor, we might get more accurate device info
      deviceName = deviceName || "Capacitor Device";
    }

    metrics.deviceName = deviceName;
    metrics.deviceModel = deviceModel;
    metrics.osVersion = osVersion;

    // Timezone
    if (results[3].status === "fulfilled") metrics.timezone = results[3].value;

    // Installed fonts
    if (results[4].status === "fulfilled")
      metrics.installedFonts = results[4].value;

    // Battery level
    if (results[5].status === "fulfilled")
      metrics.lowBatteryLevel = results[5].value;

    return metrics;
  } catch (error) {
    console.error("Error retrieving device metrics:", error);
    return {
      deviceName: "Unknown",
      deviceModel: "Unknown",
      osVersion: "Unknown",
      dpi: 1,
      gpuRenderer: "Unknown",
      gpuVendor: "Unknown",
      gpuVersion: "N/A",
      nativeWidth: 0,
      nativeHeight: 0,
      legacyWidth: 0,
      legacyHeight: 0,
      installedFonts: [],
      lowBatteryLevel: false,
      timezone: "Unknown",
    };
  }
};
