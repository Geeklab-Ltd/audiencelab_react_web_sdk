import axios from "axios";
import { prepareTokenPayload } from "../utils/preparePayload.js";
import { getDeviceMetrics } from "../utils/deviceMetrics.js";
import { updateRetention } from "../utils/retentionCalculator.js";
import { saveItem, getItem } from "../utils/storageFunctionalities.js";

const API_BASE_URL = "https://analytics.geeklab.app";

let apiKey: string | null = null;

export const setApiKey = (key: string) => {
  if (!key) {
    throw new Error("API key cannot be empty");
  }
  apiKey = key;
};

export const getApiKey = (): string => {
  if (!apiKey) {
    throw new Error("API key not set. Call initializeAudiencelab first.");
  }
  return apiKey;
};

export const initializeAudiencelab = async (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API key is required to initialize the SDK.");
  }
  setApiKey(apiKey);
  console.log("SDK initialized with API key successfully.");

  try {
    // Initialize retention tracking
    // updateRetention();

    // Fetch creative token and send metrics in parallel
    const [token, metrics] = await Promise.all([
      fetchCreativeToken(),
      sendUserMetrics(),
    ]);

    // Return after both operations complete
    return { token, metrics };
  } catch (err) {
    console.error("Failed during initialization:", err);
    throw err; // Re-throw to allow caller to handle error
  }
};

export const createAxiosInstance = () => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      "geeklab-api-key": getApiKey(),
    },
  });
};

// Centralized error handler
export const handleError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        throw new Error("Bad request, data not formatted properly.");
      case 401:
        throw new Error("API key is not valid.");
      case 404:
        throw new Error(`Request failed: ${data}`);
      case 500:
        throw new Error(`Server error: ${data}`);
      default:
        throw new Error(`Error: ${data}`);
    }
  }
  console.error("Unexpected error:", error);
  throw new Error("Failed to communicate with the server.");
};

// CALLS
export const fetchCreativeToken = async () => {
  // Check if the token is cached
  const cachedToken = await getItem("creativeToken");

  if (cachedToken) {
    console.log("Using cached creative token:", cachedToken);
    return cachedToken;
  }

  const payload = await prepareTokenPayload();
  const axiosInstance = createAxiosInstance();

  try {
    const response = await axiosInstance.post("/fetch-token", payload);
    const token = response.data.token;
    // Cache the token in AsyncStorage
    saveItem("creativeToken", token);

    return token;
  } catch (error) {
    handleError(error);
  }
};

export const verifyToken = async (token: string) => {
  const axiosInstance = createAxiosInstance();
  try {
    const response = await axiosInstance.post("/verify-token", { token });
    return response.data; // Customize this based on API response
  } catch (error) {
    handleError(error);
  }
};

export const checkDataCollectionStatus = async () => {
  const axiosInstance = createAxiosInstance();
  try {
    const response = await axiosInstance.get("/check-data-collection-status");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Webhook request examples (user metrics (type = retention))
export const sendUserMetrics = async () => {
  const today = new Date().toLocaleDateString("en-GB");
  const lastSentDate = await getItem("lastSentMetricDate");

  // Only proceed if we haven't sent metrics today
  if ((await lastSentDate) === today) {
    return;
  }

  try {
    const retentionData = await updateRetention();
    if (!retentionData) {
      return;
    }

    const resolvedData = await Promise.resolve(retentionData);

    return await sendWebhookRequest("retention", resolvedData);
  } catch (error) {
    return;
  }
};

export const sendCustomPurchaseEvent = async (
  id: string,
  name: string,
  value: number,
  currency: string,
  status: string
) => {
  const data = {
    item_id: id,
    item_name: name,
    value: value,
    currency: currency,
    status: status,
  };

  return sendWebhookRequest("custom.purchase", data);
};

export const sendCustomAdEvent = async (
  adId: string,
  name: string,
  source: string,
  watchTime: number,
  reward: boolean,
  mediaSource: string,
  channel: string,
  value: number,
  currency: string
) => {
  const data = {
    ad_id: adId,
    name: name,
    source: source,
    watch_time: watchTime,
    reward: reward,
    media_source: mediaSource,
    channel: channel,
    value: value,
    currency: currency,
  };

  return sendWebhookRequest("custom.ad", data);
};

export const sendWebhookRequest = async (type: string, data: any) => {
  const axiosInstance = createAxiosInstance();
  const currentDate = new Date();
  const currentDateText = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const deviceMetrics = getDeviceMetrics();

  // Get UTC offset
  const offset = currentDate.getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  const utcOffset = `${offset <= 0 ? "+" : "-"}${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  const retentionDay = (await getItem("retentionDay")) || "";
  const creativeToken = await getItem("creativeToken");

  const postData = {
    type,
    created_at: currentDateText,
    creativeToken: creativeToken,
    device_name: (await deviceMetrics).deviceName,
    device_model: (await deviceMetrics).deviceModel,
    os_system: (await deviceMetrics).osVersion,
    utc_offset: utcOffset,
    retention_day: retentionDay,
    payload: data,
  };

  try {
    const response = await axiosInstance.post("/webhook", postData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
