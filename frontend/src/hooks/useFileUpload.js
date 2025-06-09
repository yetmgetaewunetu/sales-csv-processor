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

    setState((prev) => ({ ...prev, isUploading: true, error: "" }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://sales-csv-processor-backend.onrender.com/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data.downloadUrl);

      setState((prev) => ({
        ...prev,
        downloadLink: response.data.downloadUrl || "",
        error: "",
        res: response.data,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Failed to process file",
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
