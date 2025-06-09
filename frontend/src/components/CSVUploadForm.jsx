import { useRef, useState } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import { FileInfoDisplay } from "./FileInfoDisplay";
import { DownloadLink } from "./DownloadLink";
import { ErrorDisplay } from "./ErrorDisplay";
import CSVPreview from "./CSVPreview";
import { Overlay } from "./overlay";

export const CSVUploadForm = () => {
  const [link, setLink] = useState(null);
  const fileInputRef = useRef(null);
  const { file, isUploading, downloadLink, error, setFile, uploadFile } =
    useFileUpload();
  // const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setLink(null);
    if (selectedFile?.type !== "text/csv") {
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    uploadFile(file);
    setLink(downloadLink);
    setFile(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className="flex flex-col gap-7">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
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
            />

            {link && <DownloadLink downloadLink={link} />}
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

const SubmitButton = ({ disabled, isUploading }) => (
  <button
    type="submit"
    disabled={disabled}
    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
      disabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {isUploading ? "Processing..." : "Process CSV"}
  </button>
);
