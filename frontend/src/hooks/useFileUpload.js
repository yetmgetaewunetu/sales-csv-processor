import { useState } from "react";
import axios from "axios";

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
        "http://localhost:5500/upload",
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
