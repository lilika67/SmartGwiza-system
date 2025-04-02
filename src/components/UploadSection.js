"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function UploadSection() {
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.elements.file.files[0];
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://ezanai.onrender.com/upload/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setUploadMessage(result.message);
        setError("");
      } else {
        setError(result.detail || "Upload failed.");
      }
    } catch (err) {
      setError("Error uploading file: " + err.message);
    }
  };

  return (
    <section id="upload" className="py-16 bg-earth-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-earth-green text-center mb-4">Upload New Training Data</h2>
        <p className="text-earth-amber text-center mb-8 max-w-2xl mx-auto">
          Upload a CSV file to update the training data for the model.
        </p>
        <form onSubmit={handleUpload} className="max-w-md mx-auto space-y-4">
          <input
            type="file"
            name="file"
            accept=".csv"
            className="w-full p-2 border border-earth-green rounded-md focus:outline-none focus:ring-2 focus:ring-earth-amber"
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-900 text-white py-2 rounded-md hover:bg-opacity-90 transition"
          >
            <Upload className="h-5 w-5" />
            Upload CSV
          </button>
        </form>
        {uploadMessage && (
          <p className="mt-4 text-earth-green text-center">{uploadMessage}</p>
        )}
        {error && (
          <p className="mt-4 text-red-600 text-center bg-red-100 p-3 rounded-md">{error}</p>
        )}
      </div>
    </section>
  );
}