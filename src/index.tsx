// src/index.tsx

export { initializeAudiencelab } from "./services/audiencelabService.js";
export {
  sendCustomPurchaseEvent,
  sendCustomAdEvent,
} from "./services/audiencelabService.js";
export { default as DebugConsole } from "./utils/debugWindow.js";

export type { CustomPurchaseEvent, CustomAdEvent } from "./types/types.js";
