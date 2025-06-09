import { useState } from "react";

// this function contains everything required  for the file upload form, which includes the states, that allows to show progress indicator
export const useFileUpload = () => {
  const [state, setState] = useState({
    file: null,
    isUploading: false,
    downloadLink: "",
    error: "",
    uploadProgress: 0,
    aggregatedData: {},
    metrics: null
  });

  const resetState = () => {
    setState({
      file: null,
      isUploading: false,
      downloadLink: "",
      error: "",
      uploadProgress: 0,
      aggregatedData: {},
      metrics: null
    });
  };

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
      aggregatedData: {},
      metrics: null
    }));

    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setState((prev) => {
          if (prev.uploadProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return {
            ...prev,
            uploadProgress: prev.uploadProgress + 10
          };
        });
      }, 500);

      const response = await fetch("http://localhost:5500/upload", {
        method: "POST",
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Upload response:", data);

      if (!data.downloadUrl) {
        throw new Error("No download URL received from server");
      }

      const totalApiTimeMs = Date.now() - startTime;
      console.log("Total API time (ms):", totalApiTimeMs);

      setState((prev) => ({
        ...prev,
        downloadLink: data.downloadUrl,
        error: "",
        uploadProgress: 100,
        aggregatedData: data.aggregatedData || {},
        metrics: {
          ...data.metrics,
          totalApiTimeMs
        }
      }));
    } catch (err) {
      console.error("Upload error:", err);
      setState((prev) => ({
        ...prev,
        error: err.message || "Failed to process file",
        downloadLink: "",
        uploadProgress: 0,
        aggregatedData: {},
        metrics: null
      }));
    } finally {
      setState((prev) => ({ ...prev, isUploading: false }));
    }
  };

  return {
    ...state,
    setFile: (file) => {
      // Reset state when a new file is selected
      resetState();
      setState((prev) => ({ ...prev, file }));
    },
    uploadFile,
  };
};
