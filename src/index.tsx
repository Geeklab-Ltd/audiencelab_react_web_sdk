// src/index.tsx

export { initializeAudiencelab } from "./services/audiencelabService.js";
export {
  sendCustomPurchaseEvent,
  sendCustomAdEvent,
  sendCustomEvent,
} from "./services/audiencelabService.js";
export {
  getTotalAdValue,
  getTotalPurchaseValue,
} from "./utils/totalValueTracker.js";
export { default as DebugConsole } from "./utils/debugWindow.js";

// Capacitor compatibility exports
export {
  isCapacitorEnvironment,
  getCapacitorDeviceInfo,
  getCapacitorNetworkInfo,
  getCapacitorBatteryInfo,
} from "./utils/capacitorCompatibility.js";

export type {
  CustomPurchaseEvent,
  CustomAdEvent,
  CustomEvent,
  CustomEventParams,
} from "./types/types.js";
