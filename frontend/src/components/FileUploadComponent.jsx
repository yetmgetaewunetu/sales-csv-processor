import { useState, useRef } from "react";

const FileUpload = ({
  multiple = false,
  accept = "*",
  maxSize = 10, // in MB
  onFileUpload,
  disabled = false,
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateFiles(selectedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateFiles(droppedFiles);
  };

  const validateFiles = (fileList) => {
    setError("");

    // Check file size
    const oversizedFiles = fileList.filter(
      (file) => file.size > maxSize * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxSize}MB`);
      return;
    }

    // If not multiple, only keep the first file
    const validatedFiles = multiple ? fileList : [fileList[0]];
    setFiles(validatedFiles);

    if (onFileUpload) {
      onFileUpload(validatedFiles);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={!disabled ? triggerFileInput : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        onDragLeave={!disabled ? handleDragLeave : undefined}
        onDrop={!disabled ? handleDrop : undefined}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {multiple ? "Multiple files allowed" : "Single file only"} • Max
            size: {maxSize}MB
          </p>
          {accept !== "*" && (
            <p className="text-xs text-gray-500">Accepted: {accept}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Selected files:</h3>
          <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-2 truncate">{file.name}</span>
                  <span className="text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)}MB
                  </span>
                </div>
                <button
                  type="button"
                  className="ml-4 text-red-600 hover:text-red-800"
                  onClick={() => removeFile(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
