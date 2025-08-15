// src/index.tsx

export { initializeAudiencelab } from "./services/audiencelabService.js";
export {
  sendCustomPurchaseEvent,
  sendCustomAdEvent,
} from "./services/audiencelabService.js";
export { default as DebugConsole } from "./utils/debugWindow.js";

// Capacitor compatibility exports
export {
  isCapacitorEnvironment,
  getCapacitorDeviceInfo,
  getCapacitorNetworkInfo,
  getCapacitorBatteryInfo,
} from "./utils/capacitorCompatibility.js";

export type { CustomPurchaseEvent, CustomAdEvent } from "./types/types.js";
