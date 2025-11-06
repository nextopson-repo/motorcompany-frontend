import { useState, useEffect } from "react";

interface SheetDataItem {
  [key: string]: string;
}

function useGCarSheetData(
  sheetId: string,
  range: string,
  apiKey: string,
  refreshInterval: number = 60000
) {
  const [data, setData] = useState<SheetDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSheetData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);

        const json = await response.json();
        if (json.values?.length > 0) {
          const headers = json.values[0];
          const rows = json.values.slice(1);
          const formattedData = rows.map((row: string[]) =>
            headers.reduce((acc: SheetDataItem, header: string, i: number) => {
              acc[header] = row[i] || "";
              return acc;
            }, {})
          );
          if (isMounted) setData(formattedData);
        } else {
          if (isMounted) setData([]);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSheetData();
    const intervalId = setInterval(fetchSheetData, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [sheetId, range, apiKey, refreshInterval]);

  return { data, loading, error };
}

export default useGCarSheetData;