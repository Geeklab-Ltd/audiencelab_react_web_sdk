export const getTimezone = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const timezone = new Date().toISOString();
      resolve(timezone);
    } catch (error) {
      reject(error);
    }
  });
};
