import { saveItem, getItem } from "./storageFunctionalities.js";

// Storage keys for total values
const TOTAL_AD_VALUE_KEY = "GeeklabSDK_TotalAdValue";
const TOTAL_PURCHASE_VALUE_KEY = "GeeklabSDK_TotalPurchaseValue";

/**
 * Gets the cumulative total ad value from localStorage
 * @returns Total ad value
 */
export const getTotalAdValue = async (): Promise<number> => {
  try {
    const value = await getItem(TOTAL_AD_VALUE_KEY);
    if (value === null || value === undefined) {
      return 0;
    }
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? 0 : numValue;
  } catch (error) {
    console.error("Error getting total ad value:", error);
    return 0;
  }
};

/**
 * Adds to the total ad value and saves it
 * @param adValue The value to add to the total
 * @returns New total ad value
 */
export const addToTotalAdValue = async (adValue: number): Promise<number> => {
  try {
    const currentTotal = await getTotalAdValue();
    const newTotal = currentTotal + adValue;
    await saveItem(TOTAL_AD_VALUE_KEY, newTotal.toString());
    return newTotal;
  } catch (error) {
    console.error("Error adding to total ad value:", error);
    return await getTotalAdValue();
  }
};

/**
 * Gets the cumulative total purchase value from localStorage
 * @returns Total purchase value
 */
export const getTotalPurchaseValue = async (): Promise<number> => {
  try {
    const value = await getItem(TOTAL_PURCHASE_VALUE_KEY);
    if (value === null || value === undefined) {
      return 0;
    }
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? 0 : numValue;
  } catch (error) {
    console.error("Error getting total purchase value:", error);
    return 0;
  }
};

/**
 * Adds to the total purchase value and saves it
 * @param purchaseValue The value to add to the total
 * @returns New total purchase value
 */
export const addToTotalPurchaseValue = async (
  purchaseValue: number
): Promise<number> => {
  try {
    const currentTotal = await getTotalPurchaseValue();
    const newTotal = currentTotal + purchaseValue;
    await saveItem(TOTAL_PURCHASE_VALUE_KEY, newTotal.toString());
    return newTotal;
  } catch (error) {
    console.error("Error adding to total purchase value:", error);
    return await getTotalPurchaseValue();
  }
};

