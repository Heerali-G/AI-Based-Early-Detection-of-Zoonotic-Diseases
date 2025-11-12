import { useState } from "react";
// Assuming pages.css contains base styles, but we'll focus on Tailwind here.
// import "./pages.css"; 

function SymptomPredictor() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!symptoms.trim()) {
      setError("Please enter at least one symptom.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // MOCK API Response for demonstration purposes:
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // Simulate different responses
      let mockData;
      if (symptoms.toLowerCase().includes("fever") && symptoms.toLowerCase().includes("rash")) {
        mockData = {
            disease: "Dengue Fever",
            matched_symptoms: ["fever", "rash", "headache"],
            suggestion: {
                "Risk Probability": 0.85,
                "Risk Level": "High",
                "Reasoning": [
                    "Strong match with core viral infection symptoms.",
                    "The combination of fever and rash is a key indicator for this disease."
                ],
                "AI Suggestion": [
                    "Seek immediate medical attention and blood tests.",
                    "Maintain hydration and rest.",
                    "Avoid self-medication with aspirin/ibuprofen."
                ]
            }
        };
      } else {
        mockData = {
            disease: "Common Cold",
            matched_symptoms: ["sore throat", "runny nose"],
            suggestion: {
                "Risk Probability": 0.15,
                "Risk Level": "Low",
                "Reasoning": ["Symptoms are mild and localized, typical of a common upper respiratory infection."],
                "AI Suggestion": ["Rest, drink fluids, and monitor symptoms.", "Consider over-the-counter cold remedies if needed."]
            }
        };
      }

      setResult(mockData);

      // Original fetch logic (uncomment to use actual backend):
      /*
      const res = await fetch("http://127.0.0.1:5000/predict_symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          user_id: localStorage.getItem("user_id") || "test_user",
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
      */
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSymptoms("");
    setResult(null);
    setError("");
  };

  // Helper function to get tailored risk colors
  const getRiskClasses = (level) => {
    switch (level) {
      case "High":
        return "bg-red-500 text-red-50 border-red-500/50 shadow-red-500/30";
      case "Moderate":
        return "bg-yellow-500 text-yellow-50 border-yellow-500/50 shadow-yellow-500/30";
      case "Low":
        return "bg-green-500 text-green-50 border-green-500/50 shadow-green-500/30";
      default:
        return "bg-gray-500 text-white border-gray-500/50 shadow-gray-500/30";
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen"> 
      <header className="text-center mb-8 p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-blue-700">
          AI Symptom Analyzer 🩺
        </h1>
        <p className="text-gray-600 mt-2">
          Enter patient symptoms for an instant, preliminary disease prediction.
        </p>
      </header>

      {/* --- Input and Controls Card --- */}
      <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 transition-all duration-300 hover:shadow-3xl">
        <textarea
          value={symptoms}
          onChange={(e) => {
            setSymptoms(e.target.value);
            setError(""); // Clear error on typing
          }}
          placeholder="Enter patient symptoms... e.g., high fever, body aches, sore throat"
          className="w-full border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-3 rounded-lg resize-none text-gray-700 placeholder-gray-400 transition-all duration-300"
          rows={5}
          disabled={loading}
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handlePredict}
            disabled={loading || !symptoms.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : "Predict Disease"}
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300"
          >
            Clear
          </button>
        </div>

        {error && (
          <p className="text-red-700 mt-4 p-3 bg-red-100 border border-red-300 rounded-lg font-medium animate-pulse">
            ⚠️ Error: {error}
          </p>
        )}
      </div>

      {/* --- Result Card --- */}
      {result && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-2xl border-t-4 border-blue-500 animate-fadeIn">
          <div className="flex justify-between items-start mb-4 pb-2 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">
              Prediction Result
            </h3>
            <span className={`px-4 py-1 text-sm rounded-full font-semibold ${getRiskClasses(result.suggestion["Risk Level"])}`}>
                {result.suggestion["Risk Level"]} Risk
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Predicted Disease */}
            <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold text-blue-700">
                    Predicted Disease: <span className="font-extrabold">{result.disease}</span>
                </p>
            </div>

            {/* Matched Symptoms */}
            <div>
              <strong className="text-gray-700 block mb-1">Matched Symptoms:</strong>
              <div className="flex flex-wrap gap-2">
                {result.matched_symptoms?.length
                  ? result.matched_symptoms.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-300">
                        {s}
                      </span>
                    ))
                  : <span className="text-gray-500 italic">No specific symptoms matched for prediction.</span>}
              </div>
            </div>

            {/* --- AI Suggestions/Details --- */}
            {result.suggestion && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">AI Analysis Summary</h4>
                
                {/* Probability Bar */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-600">Risk Probability: {(result.suggestion["Risk Probability"] * 100).toFixed(1)}%</label>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className={`h-2.5 rounded-full ${result.suggestion["Risk Level"] === 'High' ? 'bg-red-500' : result.suggestion["Risk Level"] === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${(result.suggestion["Risk Probability"] * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Reasoning */}
                {result.suggestion["Reasoning"]?.length > 0 && (
                  <div className="mb-3">
                    <strong className="text-gray-700 block mb-1">Reasoning:</strong>
                    <ul className="list-inside text-sm text-gray-600 space-y-1">
                      {result.suggestion["Reasoning"].map((r, i) => (
                        <li key={i} className="flex items-start before:content-['•'] before:mr-2 before:text-blue-500">
                            {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {result.suggestion["AI Suggestion"]?.length > 0 && (
                  <div>
                    <strong className="text-gray-700 block mb-1">Recommendations:</strong>
                    <ul className="list-inside text-sm text-gray-600 space-y-1">
                      {result.suggestion["AI Suggestion"].map((rec, i) => (
                        <li key={i} className="flex items-start before:content-['•'] before:mr-2 before:text-green-500 font-medium">
                            {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center pt-3 border-t">
              Disclaimer: This is an AI-generated, preliminary prediction and should not replace a professional medical diagnosis.
          </p>
        </div>
      )}
    </div>
  );
}

export default SymptomPredictor;
// Animation for better UX (needs to be in your CSS/Tailwind config)
/* @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}
*/