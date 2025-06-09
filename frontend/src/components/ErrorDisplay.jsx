import React from "react";
import { AlertCircle } from "lucide-react";

export const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
      <div className="flex items-center text-red-700">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p className="font-medium">{error}</p>
      </div>
    </div>
  );
};
