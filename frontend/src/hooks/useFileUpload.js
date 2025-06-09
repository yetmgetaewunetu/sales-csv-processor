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
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);
      const response = await axios.post(
        `http://localhost:5500/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
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
      }));
    } catch (err) {
      console.error("Upload error:", err);
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || err.message || "Failed to process file",
        downloadLink: "",
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
