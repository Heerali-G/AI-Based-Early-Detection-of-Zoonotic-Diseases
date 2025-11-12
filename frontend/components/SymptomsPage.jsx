import React, { useState } from "react";
import axios from "axios";
import { Stethoscope, Activity, AlertTriangle, Brain, ListChecks, Loader2, Sparkles, X } from "lucide-react";
import "./SymptomsPage.css"; 

export default function SymptomsPage({ darkMode = false }) {
    const [symptoms, setSymptoms] = useState([]);
    const [currentSymptom, setCurrentSymptom] = useState("");
    
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 1. NEW FUNCTION: This handles both comma-separated input and normal typing.
    const handleSymptomInputChange = (e) => {
        const value = e.target.value;

        // Check if the new value contains a comma
        if (value.includes(',')) {
            // User pasted or typed a comma.
            // Split by comma, clean, and filter
            const newSymptoms = value.split(',')
                .map(s => s.trim().toLowerCase())
                .filter(Boolean); // Filters out empty strings

            if (newSymptoms.length > 0) {
                // Get only the symptoms that are not already in the list
                // This prevents duplicates
                const uniqueNewSymptoms = newSymptoms.filter(s => !symptoms.includes(s));
                
                if (uniqueNewSymptoms.length > 0) {
                    setSymptoms([...symptoms, ...uniqueNewSymptoms]);
                }
            }
            // Clear the input after processing the comma-separated string
            setCurrentSymptom("");
        } else {
            // No comma, just update the current input value as the user types
            setCurrentSymptom(value);
        }
    };

    // This 'Enter' key handler remains unchanged and works with the new handler
    const handleAddSymptom = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            const newSymptom = currentSymptom.trim().toLowerCase();

            if (newSymptom && !symptoms.includes(newSymptom)) {
                setSymptoms([...symptoms, newSymptom]);
                setCurrentSymptom(""); 
            }
        }
    };

    const handleRemoveSymptom = (symptomToRemove) => {
        setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
    };

    const handleSubmit = async (e) => {
        // ... (This function remains unchanged)
        e.preventDefault();
        setError("");
        setReport(null);
        if (symptoms.length === 0) {
            setError("Please enter at least one symptom.");
            return;
        }
        const user_id = localStorage.getItem("user_id") || "guest";
        setLoading(true);
        try {
            const res = await axios.post("http://127.0.0.1:5000/predict_symptoms", {
                user_id,
                symptoms: symptoms, 
            });
            setReport(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to get prediction. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        // ... (This function remains unchanged)
        setSymptoms([]);
        setCurrentSymptom("");
        setReport(null);
        setError("");
    };

    const getRiskClass = (level) => {
        // ... (This function remains unchanged)
        if (!level) return "";
        return `risk-${level.toLowerCase()}`;
    };

    return (
        <div className={`symptoms-page ${darkMode ? "dark" : ""}`}>
            <div className="page-header">
                {/* ... (header JSX remains unchanged) ... */}
                <Stethoscope size={48} className="header-icon" />
                <div className="header-text-symptoms">
                    <h1>Symptom Analyzer</h1>
                    <p className="subtitle">Enter symptoms for AI-powered disease prediction</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="symptom-input">
                    Enter Symptoms (press Enter or comma to add):
                </label>
                
                <div className="tag-input-container">
                    <input
                        type="text"
                        id="symptom-input"
                        value={currentSymptom}
                        
                        // 2. THIS IS THE ONLY LINE YOU NEED TO CHANGE IN THE JSX
                        onChange={handleSymptomInputChange} 
                        
                        onKeyDown={handleAddSymptom}
                        placeholder={symptoms.length === 0 ? "e.g., fever, cough..." : "Add another symptom..."}
                        disabled={loading}
                    />
                    
                    <div className="tag-list">
                        {/* ... (tag-list JSX remains unchanged) ... */}
                        {symptoms.map((symptom, index) => (
                            <button
                                key={index}
                                type="button"
                                className="tag-pill"
                                onClick={() => handleRemoveSymptom(symptom)}
                                title={`Click to remove ${symptom}`} 
                            >
                                {symptom}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="button-group">
                    {/* ... (button-group JSX remains unchanged) ... */}
                    <button type="submit" disabled={loading || symptoms.length === 0} aria-busy={loading}>
                        {loading ? (
                            <><Loader2 className="spin" size={18} /> Predicting...</>
                        ) : (
                            <><Sparkles size={18} /> Predict Disease</>
                        )}
                    </button>
                    <button type="button" onClick={handleClear} className="clear-btn" disabled={loading}>
                        <X size={18} /> Clear
                    </button>
                </div>
            </form>

            {error && (
                // ... (error message JSX remains unchanged) ...
                <div className="error-message fade-in-item" role="alert">
                    <AlertTriangle size={20}/> <span>{error}</span>
                </div>
            )}

            {report && (
                <div className="report-card fade-in-item" role="region" aria-label="Prediction Report">
                    {/* ... (report card JSX remains unchanged) ... */}
                    <h2><Activity size={24} /> Prediction Result</h2>
                    <div className="report-section">
                        <strong>Disease Match:</strong>
                        <p className="disease-name">{report.disease}</p>
                    </div>
                    {report.suggestion?.["Risk Level"] && report.suggestion?.["Risk Probability"] && (
                        <div className={`report-section risk-level-display ${getRiskClass(report.suggestion["Risk Level"])}`}>
                            <strong>Risk Level:</strong>
                            <p>
                                {report.suggestion["Risk Level"]} ({(report.suggestion["Risk Probability"] * 100).toFixed(1)}% Confidence)
                            </p>
                        </div>
                    )}
                    {report.matched_symptoms?.length > 0 && (
                        <div className="report-section">
                            <strong>Matched Symptoms:</strong>
                            <p className="symptom-list">{report.matched_symptoms.join(", ")}</p>
                        </div>
                    )}
                    {report.suggestion?.["AI Suggestion"]?.length > 0 && (
                         <div className="report-section">
                            <strong><ListChecks size={18}/> AI Suggestions:</strong>
                            <ul>
                                {report.suggestion["AI Suggestion"].map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}
                    {report.suggestion?.["Reasoning"]?.length > 0 && (
                         <div className="report-section">
                            <strong><Brain size={18}/> Reasoning:</strong>
                            <ul>
                                {report.suggestion["Reasoning"].map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
}