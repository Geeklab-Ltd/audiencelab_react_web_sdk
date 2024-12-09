/** @jsx React.createElement */
import React, { useEffect, useState } from "react";
import { useFetchToken } from "../hooks/useFetchToken.js";
import {
  sendCustomAdEvent,
  sendCustomPurchaseEvent,
} from "../services/audiencelabService.js";

import { clearAllStorage, getItem } from "./storageFunctionalities.js";
import { getDeviceMetrics } from "./deviceMetrics.js";

const DebugConsole = () => {
  const { token, error, loading } = useFetchToken();

  const [storageData, setStorageData] = useState({
    retentionDay: "",
    backfillDay: "",
    firstLogin: "",
    lastLogin: "",
  });

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const retentionDay = await getItem("retentionDay");
        const backfillDay = await getItem("backfillDay");
        const firstLogin = await getItem("firstLogin");
        const lastLogin = await getItem("lastLogin");

        setStorageData({
          retentionDay: retentionDay || "",
          backfillDay: backfillDay || "",
          firstLogin: firstLogin || "",
          lastLogin: lastLogin || "",
        });
      } catch (error) {
        console.error("Failed to load storage data:", error);
      }
    };

    loadStorageData();
  }, []);

  useEffect(() => {
    // If any of the storage values are empty, retry after 2 seconds
    if (
      !storageData.retentionDay ||
      !storageData.backfillDay ||
      !storageData.firstLogin ||
      !storageData.lastLogin
    ) {
      const timer = setTimeout(() => {
        const loadData = async () => {
          try {
            const retentionDay = await getItem("retentionDay");
            const backfillDay = await getItem("backfillDay");
            const firstLogin = await getItem("firstLogin");
            const lastLogin = await getItem("lastLogin");

            setStorageData({
              retentionDay: retentionDay || "",
              backfillDay: backfillDay || "",
              firstLogin: firstLogin || "",
              lastLogin: lastLogin || "",
            });
          } catch (error) {
            console.error("Failed to reload storage data:", error);
          }
        };
        loadData();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [storageData]);

  const [purchaseResponse, setPurchaseResponse] = useState<string>("");
  const [purchaseError, setPurchaseError] = useState<string>("");

  const sendExamplePurchase = async () => {
    try {
      await sendCustomPurchaseEvent(
        "example_item_123",
        "Example Item",
        9.99,
        "USD",
        "completed"
      );
      console.log("Example purchase event sent successfully");
      setPurchaseResponse("Example purchase event sent successfully");
      setPurchaseError("");
    } catch (error) {
      console.error("Failed to send example purchase:", error);
      setPurchaseResponse("");
      setPurchaseError("Failed to send example purchase:" + error);
    }
  };

  const [adResponse, setAdResponse] = useState<string>("");
  const [adError, setAdError] = useState<string>("");

  const sendExampleAd = async () => {
    try {
      await sendCustomAdEvent(
        "example_ad_123",
        "Example Ad",
        "unity",
        30,
        true,
        "facebook",
        "social",
        0.5,
        "USD"
      );
      console.log("Example ad event sent successfully");
      setAdResponse("Example ad event sent successfully");
      setTimeout(() => {
        setAdResponse("");
      }, 4000);
      setAdError("");
    } catch (error) {
      console.error("Failed to send example ad:", error);
      setAdResponse("");
      setAdError("Failed to send example ad:" + error);
      setTimeout(() => {
        setAdError("");
      }, 4000);
    }
  };

  interface DeviceMetrics {
    deviceName: string;
    deviceModel: string;
    osVersion: string;
    dpi: number;
    gpuRenderer: string;
    gpuVendor: string;
    gpuVersion: string;
    nativeWidth: number;
    nativeHeight: number;
    legacyWidth: number;
    legacyHeight: number;
    installedFonts: string[];
    lowBatteryLevel: boolean;
    timezone: string;
  }

  const [deviceMetrics, setDeviceMetrics] = useState<DeviceMetrics>({
    deviceName: "",
    deviceModel: "",
    osVersion: "",
    dpi: 0,
    gpuRenderer: "",
    gpuVendor: "",
    gpuVersion: "",
    nativeWidth: 0,
    nativeHeight: 0,
    legacyWidth: 0,
    legacyHeight: 0,
    installedFonts: [],
    lowBatteryLevel: false,
    timezone: "",
  });

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const metrics = await getDeviceMetrics();
        setDeviceMetrics({
          deviceName: metrics.deviceName ?? "",
          deviceModel: metrics.deviceModel ?? "",
          osVersion: metrics.osVersion ?? "",
          dpi: metrics.dpi ?? 0,
          gpuRenderer: metrics.gpuRenderer ?? "",
          gpuVendor: metrics.gpuVendor ?? "",
          gpuVersion: metrics.gpuVersion ?? "",
          nativeWidth: metrics.nativeWidth ?? 0,
          nativeHeight: metrics.nativeHeight ?? 0,
          legacyWidth: metrics.legacyWidth ?? 0,
          legacyHeight: metrics.legacyHeight ?? 0,
          installedFonts: (metrics.installedFonts as string[]) ?? [],
          lowBatteryLevel: metrics.lowBatteryLevel ?? false,
          timezone: metrics.timezone ?? "",
        });
      } catch (error) {
        console.error("Failed to get device metrics:", error);
        // Set default values when native bridge fails
        setDeviceMetrics({
          deviceName: "",
          deviceModel: "",
          osVersion: "",
          dpi: 0,
          gpuRenderer: "",
          gpuVendor: "",
          gpuVersion: "",
          nativeWidth: 0,
          nativeHeight: 0,
          legacyWidth: 0,
          legacyHeight: 0,
          installedFonts: [],
          lowBatteryLevel: false,
          timezone: "",
        });
      }
    };
    getMetrics();
  }, []);

  const [isStorageVisible, setIsStorageVisible] = useState<boolean>(false);
  const [isDeviceVisible, setIsDeviceVisible] = useState<boolean>(false);

  const [debugIsVisible, setDebugIsVisible] = useState<boolean>(false);

  return debugIsVisible ? (
    <div
      style={{
        position: "fixed",
        zIndex: 9999999,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        height: "90vh",
        backgroundColor: "rgba(51, 51, 51, 0.95)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "8px",
        padding: "16px",
        margin: 0,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        overflowY: "auto",
      }}
    >
      <h1 style={styles.title}>Audiencelab SDK</h1>
      {loading && <p style={styles.text}>Loading token...</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}
      {token && <p style={styles.text}>Creative Token: {token}</p>}
      <div
        style={{
          ...styles.section,
          ...(isStorageVisible ? {} : styles.hidden),
        }}
      >
        <button
          onClick={() => setIsStorageVisible(!isStorageVisible)}
          style={{
            fontSize: "18px",
            color: "#fff",
            marginBottom: "8px",
            padding: "8px",
            height: "40px",
            backgroundColor: "transparent",
            textDecoration: "none",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left" as const,
          }}
        >
          Local Storage Data
        </button>
        <p style={styles.text}>
          Retention Day:{" "}
          {JSON.stringify(storageData?.retentionDay) || "Not set"}
        </p>
        <p style={styles.text}>
          Backfill Day: {JSON.stringify(storageData?.backfillDay) || "Not set"}
        </p>
        <p style={styles.text}>
          First Login: {JSON.stringify(storageData?.firstLogin) || "Not set"}
        </p>
        <p style={styles.text}>
          Last Login: {JSON.stringify(storageData?.lastLogin) || "Not set"}
        </p>
      </div>
      <div
        style={{ ...styles.section, ...(isDeviceVisible ? {} : styles.hidden) }}
      >
        <button
          onClick={() => setIsDeviceVisible(!isDeviceVisible)}
          style={{
            fontSize: "18px",
            color: "#fff",
            marginBottom: "8px",
            padding: "8px",
            height: "40px",
            backgroundColor: "transparent",
            textDecoration: "none",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          Device Metrics
        </button>
        <p style={styles.text}>Device Name: {deviceMetrics.deviceName}</p>
        <p style={styles.text}>Device Model: {deviceMetrics.deviceModel}</p>
        <p style={styles.text}>OS Version: {deviceMetrics.osVersion}</p>
        <p style={styles.text}>DPI: {deviceMetrics.dpi}</p>
        <p style={styles.text}>GPU Renderer: {deviceMetrics.gpuRenderer}</p>
        <p style={styles.text}>GPU Vendor: {deviceMetrics.gpuVendor}</p>
        <p style={styles.text}>GPU Version: {deviceMetrics.gpuVersion}</p>
        <p style={styles.text}>Native Width: {deviceMetrics.nativeWidth}</p>
        <p style={styles.text}>Native Height: {deviceMetrics.nativeHeight}</p>
        <p style={styles.text}>Legacy Width: {deviceMetrics.legacyWidth}</p>
        <p style={styles.text}>Legacy Height: {deviceMetrics.legacyHeight}</p>
        <p style={styles.text}>
          Installed Fonts: {deviceMetrics.installedFonts?.join(", ")}
        </p>
        <p style={styles.text}>
          Low Battery: {deviceMetrics.lowBatteryLevel ? "Yes" : "No"}
        </p>
        <p style={styles.text}>Timezone: {deviceMetrics.timezone}</p>
      </div>
      <div style={styles.section}>
        <button
          style={{
            backgroundColor: "#4CAF50",
            borderRadius: "4px",
            padding: "8px",
            color: "#fff",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
          onClick={sendExamplePurchase}
        >
          Send Example Purchase
        </button>
        {purchaseResponse && (
          <p style={styles.successText}>{purchaseResponse}</p>
        )}
        {purchaseError && <p style={styles.errorText}>{purchaseError}</p>}
      </div>

      <div style={styles.section}>
        <button
          style={{
            backgroundColor: "#4CAF50",
            borderRadius: "4px",
            padding: "8px",
            color: "#fff",
            textAlign: "center" as const,
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
          onClick={sendExampleAd}
        >
          Send Example Ad Event
        </button>
        {adResponse && <p style={styles.successText}>{adResponse}</p>}
        {adError && <p style={styles.errorText}>{adError}</p>}
      </div>

      <div style={styles.section}>
        <button
          style={{
            backgroundColor: "#ff4444",
            borderRadius: "4px",
            padding: "8px",
            color: "#fff",
            textAlign: "center" as const,
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
          onClick={() => setDebugIsVisible(false)}
        >
          Close Debuglog
        </button>
      </div>
    </div>
  ) : (
    <React.Fragment>
      <button
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "8px 12px",
          cursor: "pointer",
          zIndex: 9999,
        }}
        onClick={() => setDebugIsVisible(true)}
      >
        Show Debug
      </button>
    </React.Fragment>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90vh",
    backgroundColor: "rgba(51, 51, 51, 0.95)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)", // For Safari support
    borderRadius: "8px",
    padding: "16px",
    margin: 0,
    fontFamily: "System",
    overflowY: "scroll",
  },
  hidden: {
    maxHeight: "30px",
    overflow: "hidden",
  },
  title: {
    fontSize: "18px",
    color: "#fff",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#fff",
    marginBottom: "8px",
    padding: "4px",
    height: "30px",
    backgroundColor: "#444",
    textDecoration: "underline",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
  },
  text: {
    fontSize: "14px",
    color: "#fff",
    margin: "4px 0",
  },
  errorText: {
    fontSize: "14px",
    color: "#ff6b6b",
    margin: "8px 0",
  },
  successText: {
    fontSize: "14px",
    color: "#4CAF50",
    margin: "8px 0",
  },
  section: {
    marginTop: "12px",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: "4px",
    padding: "8px",
    color: "white",
    textAlign: "center",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
};

export default DebugConsole;
