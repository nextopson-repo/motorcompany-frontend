// import { useState, useEffect } from "react";

// interface SheetDataItem {
//   [key: string]: string;
// }

// function useGCitySheetData(
//   sheetId: string,
//   range: string,
//   apiKey: string,
//   refreshInterval: number = 300000  //5min = 300000ms
// ) {
//   const [data, setData] = useState<SheetDataItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchSheetData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error(
//             `Error fetching data: ${response.status} ${response.statusText}`
//           );
//         }
//         const json = await response.json();
//         if (json.values && json.values.length > 0) {
//           const headers: string[] = json.values[0];
//           const rows: string[][] = json.values.slice(1);
//           const formattedData: SheetDataItem[] = rows.map((row: string[]) => {
//             const obj: SheetDataItem = {};
//             headers.forEach((header: string, index: number) => {
//               obj[header] = row[index] || "";
//             });
//             return obj;
//           });
//           if (isMounted) setData(formattedData);
//         } else {
//           if (isMounted) setData([]);
//         }
//       } catch (err: unknown) {
//         if (isMounted) {
//           if (err instanceof Error) {
//             setError(err.message);
//           } else {
//             setError(String(err));
//           }
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchSheetData();

//     // Poll for updates every refreshInterval milliseconds (default 60s)
//     const intervalId = setInterval(fetchSheetData, refreshInterval);

//     return () => {
//       isMounted = false;
//       clearInterval(intervalId);
//     };
//   }, [sheetId, range, apiKey, refreshInterval]);

//   return { data, loading, error };
// }

// export default useGCitySheetData;
