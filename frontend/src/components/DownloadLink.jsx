// download link button that is displayed when a processed csv file is returned

import React from "react";
import { Download } from "lucide-react";

export const DownloadLink = ({ downloadLink }) => {
  if (!downloadLink) return null;

  return (
    <div className="mt-4 p-4 bg-green-50 rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-green-700 font-medium">File processed successfully!</p>
        <button
          onClick={() => window.open(downloadLink, "_blank")}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Processed File
        </button>
      </div>
    </div>
  );
};
