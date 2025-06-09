import { useRef, useState, useEffect } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import { FileInfoDisplay } from "./FileInfoDisplay";
import { DownloadLink } from "./DownloadLink";
import { ErrorDisplay } from "./ErrorDisplay";
import { ProcessingResults } from "./ProcessingResults";
import CSVPreview from "./CSVPreview";

// the entry for the upload form
// includes custom upload component and button to send post request to backend server
export const CSVUploadForm = () => {
  const [link, setLink] = useState(null);
  const fileInputRef = useRef(null);
  const { file, isUploading, downloadLink, error, setFile, uploadFile, uploadProgress, metrics, aggregatedData } =
    useFileUpload();

  // Update link when downloadLink changes
  useEffect(() => {
    if (downloadLink) {
      setLink(downloadLink);
    }
  }, [downloadLink]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setLink(null);
    if (!selectedFile) {
      setFile(null);
      return;
    }
    // Check if file is CSV by extension or type
    const isCSV = selectedFile.type === "text/csv" || 
                 selectedFile.name.toLowerCase().endsWith('.csv');
    if (!isCSV) {
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadFile(file);
      // Clear the file input after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className="flex flex-col gap-7">
        <div className="w-11/12 mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            CSV Sales Data Processor
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                file
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              } cursor-pointer`}
              onClick={triggerFileInput}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv, text/csv"
                onChange={handleFileChange}
              />
              {file ? (
                <FileInfoDisplay file={file} />
              ) : (
                <DefaultUploadContent />
              )}
            </div>

            <ErrorDisplay error={error} />

            <SubmitButton
              disabled={!file || isUploading}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />

            {link && <DownloadLink downloadLink={link} />}
            
            <ProcessingResults metrics={metrics} aggregatedData={aggregatedData} />
          </form>
        </div>
        <CSVPreview file={file} />
      </div>
    </>
  );
};

// Small helper components
const DefaultUploadContent = () => (
  <>
    <p className="text-sm text-gray-600">
      <span className="font-medium text-blue-600">Click to upload</span> or drag
      and drop
    </p>
    <p className="text-xs text-gray-500">CSV files only</p>
  </>
);

const SubmitButton = ({ disabled, isUploading, uploadProgress }) => (
  <button
    type="submit"
    disabled={disabled}
    className={`w-full py-2 px-4 rounded-md text-white font-medium relative overflow-hidden ${
      disabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {isUploading ? (
      <div className="relative z-10 flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {uploadProgress}%
      </div>
    ) : (
      "Process CSV"
    )}
    {isUploading && (
      <div 
        className="absolute inset-0 bg-blue-700 transition-all duration-300"
        style={{ 
          width: `${uploadProgress}%`,
          left: 0,
          top: 0,
          height: '100%'
        }}
      />
    )}
  </button>
);