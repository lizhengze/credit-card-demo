import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [selected, setSelected] = useState({});
  const [apr, setApr] = useState(0);
  const [fee, setFee] = useState(0);
  const [email, setEmail] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [features, setFeatures] = useState([]);

useEffect(() => {
  axios
    .get("http://localhost:4000/api/features")
    .then((res) => {
      const formattedFeatures = res.data.map((f) => ({
        key: f.key,
        label: f.name,
        apr: f.apr,
        fee: f.fee
      }));
      setFeatures(formattedFeatures);
    })
    .catch((err) => {
      console.error("Failed to load features:", err);
    });
}, []);


  const toggleFeature = (key) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateTotals = async () => {
    try {
      const response = await fetch("http://localhost:4000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected })
      });
      const data = await response.json();
      setApr(data.apr);
      setFee(data.fee);
    } catch (error) {
      console.error("Failed to fetch pricing", error);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [selected]);

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setSubmissionMessage("❌ Please enter a valid email address.");
      return;
    }

    const hasSelectedFeature = Object.values(selected).some((v) => v === true);
    if (!hasSelectedFeature) {
      setSubmissionMessage("❌ Please select at least one feature.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/submit", {
        email: email,
        selectedFeatures: selected
      });
      console.log("Server response:", response.data);
      setSubmissionMessage("✅ Submission successful! Thank you!");
      setEmail("");
      setSelected({});
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionMessage("❌ Submission failed. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      
      <h1 className="text-2xl font-bold text-center">Customize Your Credit Card</h1>

      {features.map((f) => (
        <div key={f.key} className="flex justify-between items-center p-4 border rounded">
          <span>{f.label}</span>
          <div
            onClick={() => toggleFeature(f.key)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              selected[f.key] ? "bg-neutral-800" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                selected[f.key] ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
      ))}

      <div className="p-4 space-y-2 border rounded">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>Estimated APR: <strong>{apr}%</strong></p>
        <p>Annual Fee: <strong>${fee}</strong></p>
      </div>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded mt-4"
      />

      <button
        onClick={handleSubmit}
        disabled={!email || Object.values(selected).every((v) => v === false)}
        className={`w-full py-2 px-4 rounded transition-colors ${
          !email || Object.values(selected).every((v) => v === false)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        Submit My Custom Card
      </button>

      {submissionMessage && (
        <div
          className={`text-center mt-4 text-lg font-semibold ${
            submissionMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {submissionMessage}
        </div>
      )}
    </div>
  );
}

export default Home;