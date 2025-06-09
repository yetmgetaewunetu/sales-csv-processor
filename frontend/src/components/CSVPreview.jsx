import { useState, useEffect } from "react";
import { parse } from "papaparse";

const CSVPreview = ({ file, maxRows = 5 }) => {
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewData([]);
      return;
    }

    const previewCSV = () => {
      setIsLoading(true);
      setError("");

      parse(file, {
        header: true,
        preview: maxRows,
        complete: (results) => {
          setPreviewData(results.data);
          setIsLoading(false);
        },
        error: (error) => {
          setError("Failed to parse CSV file");
          setIsLoading(false);
          console.error("CSV parsing error:", error);
        },
      });
    };

    previewCSV();
  }, [file, maxRows]);

  if (!file) return null;

  return (
    <div className="mt-6 border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b">
        <h3 className="font-medium text-gray-700">
          CSV Preview (First {maxRows} rows)
        </h3>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading preview...</div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {previewData[0] &&
                  Object.keys(previewData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewData.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((value, j) => (
                    <td
                      key={`${i}-${j}`}
                      className="px-4 py-2 whitespace-nowrap text-sm text-gray-500"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CSVPreview;
