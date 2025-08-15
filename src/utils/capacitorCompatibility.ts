// Capacitor compatibility layer for better device information

interface CapacitorDeviceInfo {
  name?: string;
  model?: string;
  platform?: string;
  operatingSystem?: string;
  osVersion?: string;
  manufacturer?: string;
  isVirtual?: boolean;
  webViewVersion?: string;
}

interface CapacitorNetworkInfo {
  connected?: boolean;
  connectionType?: string;
  effectiveType?: string;
}

// Type declarations for Capacitor modules
interface CapacitorDevice {
  getInfo(): Promise<CapacitorDeviceInfo>;
  getBatteryInfo?(): Promise<{ batteryLevel: number; isCharging: boolean }>;
}

interface CapacitorNetwork {
  getStatus(): Promise<CapacitorNetworkInfo>;
}

let capacitorDevice: CapacitorDevice | null = null;
let capacitorNetwork: CapacitorNetwork | null = null;

// Try to load Capacitor plugins from global scope
const loadCapacitorPlugins = async () => {
  try {
    // Check if Capacitor is available in the global scope
    const Capacitor = (window as any).Capacitor;
    if (Capacitor) {
      // Try to access plugins through Capacitor global
      if (Capacitor.Plugins?.Device) {
        capacitorDevice = Capacitor.Plugins.Device;
      }
      if (Capacitor.Plugins?.Network) {
        capacitorNetwork = Capacitor.Plugins.Network;
      }

      if (capacitorDevice || capacitorNetwork) {
        console.log("Capacitor plugins loaded successfully from global scope");
        return true;
      }
    }

    // Also check for Ionic global (older versions)
    const Ionic = (window as any).Ionic;
    if (Ionic?.Capacitor) {
      if (Ionic.Capacitor.Plugins?.Device) {
        capacitorDevice = Ionic.Capacitor.Plugins.Device;
      }
      if (Ionic.Capacitor.Plugins?.Network) {
        capacitorNetwork = Ionic.Capacitor.Plugins.Network;
      }

      if (capacitorDevice || capacitorNetwork) {
        console.log("Capacitor plugins loaded successfully from Ionic global");
        return true;
      }
    }

    console.log("Capacitor plugins not available in global scope");
    return false;
  } catch (error) {
    console.log("Capacitor plugins not available, using fallback methods");
    return false;
  }
};

export const getCapacitorDeviceInfo =
  async (): Promise<CapacitorDeviceInfo> => {
    if (!capacitorDevice) {
      await loadCapacitorPlugins();
    }

    if (capacitorDevice) {
      try {
        const info = await capacitorDevice.getInfo();
        return {
          name: info.name,
          model: info.model,
          platform: info.platform,
          operatingSystem: info.operatingSystem,
          osVersion: info.osVersion,
          manufacturer: info.manufacturer,
          isVirtual: info.isVirtual,
          webViewVersion: info.webViewVersion,
        };
      } catch (error) {
        console.warn("Failed to get Capacitor device info:", error);
      }
    }

    return {};
  };

export const getCapacitorNetworkInfo =
  async (): Promise<CapacitorNetworkInfo> => {
    if (!capacitorNetwork) {
      await loadCapacitorPlugins();
    }

    if (capacitorNetwork) {
      try {
        const status = await capacitorNetwork.getStatus();
        return {
          connected: status.connected,
          connectionType: status.connectionType,
          effectiveType: status.effectiveType,
        };
      } catch (error) {
        console.warn("Failed to get Capacitor network info:", error);
      }
    }

    return {};
  };

export const isCapacitorEnvironment = (): boolean => {
  return (
    !!(window as any).Capacitor ||
    !!(window as any).Ionic ||
    navigator.userAgent.includes("Capacitor") ||
    navigator.userAgent.includes("Ionic")
  );
};

export const getCapacitorBatteryInfo = async (): Promise<{
  level: number;
  isCharging: boolean;
} | null> => {
  if (!capacitorDevice) {
    await loadCapacitorPlugins();
  }

  if (capacitorDevice && capacitorDevice.getBatteryInfo) {
    try {
      const batteryInfo = await capacitorDevice.getBatteryInfo();
      return {
        level: batteryInfo.batteryLevel || 0,
        isCharging: batteryInfo.isCharging || false,
      };
    } catch (error) {
      console.warn("Failed to get Capacitor battery info:", error);
    }
  }

  return null;
};
