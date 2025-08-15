import { getCapacitorBatteryInfo } from "../capacitorCompatibility.js";

// Type definition for Battery API
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

export const getBatteryLevel = async (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      // First try Capacitor battery info if available
      const capacitorBattery = await getCapacitorBatteryInfo();
      if (capacitorBattery) {
        // Consider low battery if below 20%
        resolve(capacitorBattery.level < 0.2);
        return;
      }

      // Check if Battery API is available (works in some Capacitor environments)
      if ("getBattery" in navigator) {
        (navigator as any)
          .getBattery()
          .then((battery: BatteryManager) => {
            const level = battery.level;
            // Consider low battery if below 20%
            resolve(level < 0.2);
          })
          .catch(() => {
            // Fallback if Battery API fails
            resolve(false);
          });
      } else if ("battery" in navigator) {
        // Legacy battery API
        const battery = (navigator as any).battery as BatteryManager;
        if (battery) {
          resolve(battery.level < 0.2);
        } else {
          resolve(false);
        }
      } else {
        // Fallback for Capacitor and other environments
        // Check if we're in a mobile environment
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        const isLowPowerMode =
          (navigator as any).connection?.effectiveType === "slow-2g" ||
          (navigator as any).connection?.effectiveType === "2g";

        // In mobile environments, assume normal battery unless we detect low power mode
        resolve(isMobile && isLowPowerMode);
      }
    } catch (error) {
      // Default to false (normal battery) if all methods fail
      resolve(false);
    }
  });
};
