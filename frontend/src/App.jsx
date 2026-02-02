import React, { useState } from "react";

export default function App() {
  const [visitorName, setVisitorName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/generate-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_name: visitorName }),
      });
      const data = await res.json();
      setResult({ ok: res.ok, data });
    } catch (err) {
      setResult({ ok: false, data: { error: "network error" } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 24, maxWidth: 480 }}>
      <h2>Visitor Pass</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Visitor name
          <input
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
            placeholder="Enter visitor name"
          />
        </label>
        <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "Generating…" : "Generate Pass"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20, padding: 12, border: "1px solid #ddd" }}>
          {result.ok ? (
            <div>
              <div>
                <strong>Name:</strong> {result.data.visitor_name}
              </div>
              <div>
                <strong>Pass code:</strong> {result.data.pass_code}
              </div>
              <div>
                <strong>Created at:</strong> {result.data.created_at}
              </div>
            </div>
          ) : (
            <div style={{ color: "red" }}>Error: {result.data.error}</div>
          )}
        </div>
      )}
    </div>
  );
}
