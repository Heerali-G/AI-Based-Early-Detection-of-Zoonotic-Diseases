// 1. IMPORT ICONS
import React, { useState, useEffect } from "react"; // Added useEffect
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css"; 
// Icon Imports
import { 
  FaMicroscope, FaFileMedical, FaExclamationTriangle 
} from "react-icons/fa";
import { 
  FiUploadCloud, FiCheckCircle 
} from "react-icons/fi";


export default function UploadPage({ darkMode = false }) {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  // 2. NEW STATE FOR PREVIEW
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  // 3. USEEFFECT FOR PREVIEW CLEANUP
  // This is important to prevent memory leaks
  useEffect(() => {
    // If we have a preview URL, we need to revoke it when the
    // component unmounts or when the file changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleUpload = async () => {
    // ... (This function remains unchanged)
    if (!file) {
      setError("Please select a file");
      return;
    }
    setLoading(true);
    setError("");
    setReport(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", localStorage.getItem("user_id") || "test_user");
    try {
      const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReport(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to upload file. Check server status and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (level) => {
    // ... (This function remains unchanged)
    if (!level) return "";
    switch (level.toLowerCase()) {
      case "high":
        return "risk-high";
      case "moderate":
        return "risk-moderate";
      case "low":
        return "risk-low";
      default:
        return "";
    }
  };

  const calculateCtRisk = (ctValues) => {
    // ... (This function remains unchanged)
    if (!ctValues || Object.keys(ctValues).length === 0) {
      return { level: "Unknown", text: "N/A" };
    }
    const HIGH_RISK_THRESHOLD = 20;
    const MODERATE_RISK_THRESHOLD = 30;
    const numericCts = Object.values(ctValues)
      .map(parseFloat)
      .filter((v) => !isNaN(v));
    if (numericCts.length === 0) {
      return { level: "Unknown", text: "N/A" };
    }
    const minCt = Math.min(...numericCts);
    const minCtText = minCt.toFixed(1);
    if (minCt < HIGH_RISK_THRESHOLD) {
      return { level: "High", text: minCtText };
    }
    if (minCt <= MODERATE_RISK_THRESHOLD) {
      return { level: "Moderate", text: minCtText };
    }
    return { level: "Low", text: minCtText };
  };

  // 4. UPDATED FILE HANDLER TO CREATE PREVIEW
  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setError("");

      // Revoke old preview if one exists
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      // Create a preview URL for image files
      if (selectedFile.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null); // Not an image, no preview
      }
    }
  };


  const ctRisk = report ? calculateCtRisk(report.ct_values) : null;

  const statusClass =
    report?.result?.toLowerCase() === "positive"
      ? "result-positive"
      : report?.result?.toLowerCase() === "negative"
      ? "result-negative"
      : "result-unknown";

  return (
    <div className={`app-dashboard ${darkMode ? "dark-theme" : "light-theme"}`}>
      {/* --- HEADER --- */}
        {/* --- HEADER --- */}
      <header className="dashboard-header">
        <div className="app-logo">
          <FaMicroscope />
        </div>
        
        {/* NEW: Wrapper for title and subtitle */}
        <div className="header-text">
          <h1 className="app-title">Zoonotic Disease Analysis Platform</h1>
          <p className="app-subtitle">
            {/* Using <strong> for proper HTML bolding */}
            Securely upload your <strong>RT-PCR report</strong> or symptom file for rapid
            analysis.
          </p>
        </div>
      </header>

      {/* --- MAIN UPLOAD CARD --- */}
      <div className="upload-section">
        <h2 className="section-title">1. Upload Report</h2>
        <div className="upload-container">
          <label
            htmlFor="file-upload"
            className={`file-dropzone ${file ? "file-selected" : ""} ${
              loading ? "disabled-interaction" : ""
            } ${isDragging ? "dragging" : ""}`}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0]);
              }
            }}
          >
            {/* 6. PREVIEW & ICON LOGIC */}
            <span className="upload-icon">
              {preview ? (
                <img src={preview} alt="File preview" className="preview-image" />
              ) : file ? (
                <FaFileMedical />
              ) : (
                <FiUploadCloud />
              )}
            </span>

            <p className="upload-text">
              {file
                ? `File Selected: ${file.name}`
                : "Click to select or drag a file here"}
            </p>
            <p className="upload-hint">PDF, JPG, PNG | Max 5MB</p>
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            disabled={loading}
          />

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="analyze-btn"
          >
            {loading && <span className="spinner"></span>}
            {loading ? "Analyzing Report..." : "Start Analysis"}
          </button>

          {error && <p className="error-message">{error}</p>}
          {loading && <div className="loading-bar"></div>}
        </div>
      </div>

      {/* --- REPORT RESULT DASHBOARD --- */}
      {report && (
        <div className={`report-dashboard ${statusClass}`}>
          <h2 className="section-title">2. Analysis Results</h2>

          <div className="status-bar">
            <div className="status-icon-box">
              {/* 7. ICON REPLACEMENT */}
              {report.result?.toLowerCase() === "positive" ? (
                <FaExclamationTriangle />
              ) : (
                <FiCheckCircle />
              )}
            </div>
            <div className="status-summary">
              <p className="status-title">Overall Result</p>
              <p className={`status-value ${statusClass}`}>{report.result}</p>
            </div>
            <div className="disease-summary">
              <p className="status-title">Disease Detected</p>
              <p className="status-value">{report.disease}</p>
            </div>
          </div>

          <div className="data-grid">
            {/* Risk Assessment Tile */}
            {ctRisk && ctRisk.level !== "Unknown" && (
              <div className={`data-tile ${getRiskClass(ctRisk.level)}`}>
                <label className="tile-label">Viral Load Risk (Ct-based)</label>
                <p className="tile-value">{ctRisk.level}</p>
                <span className="tile-hint">
                  Min Ct: {ctRisk.text} (Lower is higher risk)
                </span>
              </div>
            )}

            {/* Detailed Ct Values Tile */}
            {report.ct_values && Object.keys(report.ct_values).length > 0 && (
              <div className="data-tile ct-detail-tile">
                <label className="tile-label">Ct Values by Gene</label>
                <ul className="ct-list">
                  {Object.entries(report.ct_values).map(([gene, value]) => (
                    <li key={gene} className="ct-gene-item">
                      <span className="gene-name">{gene}:</span>
                      <span className="gene-value">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* AI Suggestions Section */}
          {report.disease?.toLowerCase() !== "unknown" &&
            Array.isArray(report.suggestion?.["AI Suggestion"]) &&
            report.suggestion["AI Suggestion"].length > 0 && (
              <div className="suggestions-panel">
                <h4>Recommendations from AI:</h4>
                <ul className="suggestion-list">
                  {report.suggestion["AI Suggestion"].map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

          <p className="disclaimer-text">
            *This analysis is AI-generated and is not a substitute for
            professional medical diagnosis or advice.
          </p>
        </div>
      )}
    </div>
  );
}