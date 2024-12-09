import { useState, useEffect } from "react";
import { fetchCreativeToken } from "../services/audiencelabService.js";
import { clearCreativeTokenCache } from "../utils/clearCache.js";

export const useFetchToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await fetchCreativeToken();
        setToken(token);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        clearCreativeTokenCache(); // Clear cache if the fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { token, error, loading };
};
