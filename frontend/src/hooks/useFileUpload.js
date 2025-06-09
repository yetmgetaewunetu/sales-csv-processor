import { useState } from "react";
import axios from "axios";

// this function contains everything required  for the file upload form, which includes the states, that allows to show progress indicator
export const useFileUpload = () => {
  const [state, setState] = useState({
    file: null,
    isUploading: false,
    downloadLink: "",
    error: "",
    res: null,
    uploadProgress: 0,
  });

  const uploadFile = async (file) => {
    if (!file) {
      setState((prev) => ({ ...prev, error: "Please select a file first" }));
      return;
    }

    // Reset states before starting upload
    setState((prev) => ({
      ...prev,
      isUploading: true,
      error: "",
      downloadLink: "",
      uploadProgress: 0,
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);
      const response = await axios.post(
        `https://sales-csv-processor-backend.onrender.com/upload`,
        // `http://localhost:5500/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setState((prev) => ({
              ...prev,
              uploadProgress: percentCompleted,
            }));
          },
        }
      );
      console.log("Upload response:", response.data);

      if (!response.data.downloadUrl) {
        throw new Error("No download URL received from server");
      }

      setState((prev) => ({
        ...prev,
        downloadLink: response.data.downloadUrl,
        error: "",
        res: response.data,
        uploadProgress: 100,
      }));
    } catch (err) {
      console.error("Upload error:", err);
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || err.message || "Failed to process file",
        downloadLink: "",
        uploadProgress: 0,
      }));
    } finally {
      setState((prev) => ({ ...prev, isUploading: false }));
    }
  };

  return {
    ...state,
    setFile: (file) => setState((prev) => ({ ...prev, file })),
    uploadFile,
  };
};
