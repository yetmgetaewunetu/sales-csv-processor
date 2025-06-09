import React from "react";

const formatTime = (ms) => {
  if (!ms) return "0s";
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
};

export const ProcessingResults = ({ metrics, aggregatedData }) => {
  if (!metrics && !aggregatedData) return null;

  return (
    <div className="mt-6 space-y-6">
      {metrics && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Processing Results</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Rows</p>
              <p className="text-lg font-medium">{metrics.totalRows.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Departments</p>
              <p className="text-lg font-medium">{metrics.uniqueDepartments}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Processing Time</p>
              <p className="text-lg font-medium">{formatTime(metrics.processingTimeMs)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total API Time</p>
              <p className="text-lg font-medium">{formatTime(metrics.totalApiTimeMs)}</p>
            </div>
          </div>
        </div>
      )}

      {aggregatedData && Object.keys(aggregatedData).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Department Sales</h3>
          <div className="space-y-2">
            {Object.entries(aggregatedData).map(([department, total]) => (
              <div key={department} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="font-medium">{department}</span>
                <span className="text-green-600 font-semibold">
                  ${Number(total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 