import { useCallback, useState } from "react";

export const useRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState(null);
  const request = useCallback(
    async (url: any, method = "GET", body: any = null, headers: any = {}) => {
      setLoading(true);
      try {
        if (body) {
          body = JSON.stringify(body);
          headers["Content-Type"] = "application/json";
        }
        const response = await fetch(url, { method, body, headers });
        const data = await response.json();

        setLoading(false);
        if (data?.error) {
          return setError(data.error);
        }
        setData(data.data);
      } catch (e: any) {
        setLoading(false);
        setError(e);
        throw e;
      }
    },
    []
  );
  const clearError = useCallback(() => setError(null), []);
  return { loading, request, error, data, clearError };
};
