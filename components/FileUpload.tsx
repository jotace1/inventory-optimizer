"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ThresholdForm from "./ThresholdForm";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: any, params: any) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [file, setFile] = useState<File>();

  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  const handleSubmit = (params: any) => {
    if (file) {
      onFileUpload(file, params);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="mt-2 text-sm text-gray-600">
            Drop the CSV file here...
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop a CSV file here, or click to select a file
          </p>
        )}
      </div>
      {file && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Selected file: {file.name}</p>
          <p className="text-sm text-gray-600">
            File size: {(file.size / 1024).toFixed(2)} KB
          </p>
          <ThresholdForm onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
