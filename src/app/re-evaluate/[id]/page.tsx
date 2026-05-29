"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Brain, TrendingUp, TrendingDown, Activity, AlertTriangle,
  CheckCircle, Target, Droplets, Dumbbell, Salad, Sparkles,
  ArrowLeft, ChevronRight,
} from "lucide-react";

export default function ReEvaluatePage() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAnalysis() {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("fitai_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/re-evaluate/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      setAnalysis(data);
    } catch {
      setError("Analysis failed. Make sure the client has progress data.");
    }
    setLoading(false);
  }

  return (
    <div className="page-content" style={{ maxWidth: 800, margin: "0 auto" }}>
      <Link href={`/clients/${params.id}`} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to client
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p className="text-xs">AI Re-Evaluation</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "2px 0 4px" }}>
            Progress Analysis
          </h1>
          <p className="text-muted" style={{ fontSize: 14 }}>
            Analyze progress, compare goals, and get AI-powered plan recommendations
          </p>
        </div>
        <button onClick={runAnalysis} disabled={loading} className="btn btn-primary btn-lg">
          {loading ? "Analyzing..." : <><Brain size={18} /> Run Analysis</>}
        </button>
      </div>

      {error && (
        <div className="ai-insight" style={{ borderColor: "var(--red)", background: "var(--red-subtle)" }}>
          <AlertTriangle size={20} style={{ color: "var(--red)" }} />
          <p style={{ fontSize: 13, margin: 0 }}>{error}</p>
        </div>
      )}

      {analysis && (
        <>
          {/* Status */}
          <div className={`ai-insight ${analysis.goalAligned === "on_track" ? "" : ""}`}
            style={{
              borderColor: analysis.goalAligned === "on_track" ? "var(--emerald)" : "var(--orange)",
              background: analysis.goalAligned === "on_track" ? "var(--emerald-subtle)" : "var(--orange-subtle)",
            }}
          >
            {analysis.goalAligned === "on_track" ? (
              <CheckCircle size={24} style={{ color: "var(--emerald)" }} />
            ) : (
              <Target size={24} style={{ color: "var(--orange)" }} />
            )}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--text)" }}>
                {analysis.goalAligned === "on_track" ? "On Track ✓" : analysis.goalAligned === "off_track" ? "Off Track - Needs Adjustment" : "Tracking..."}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "2px 0 0" }}>
                Goal: {analysis.goal} · Client: {analysis.clientName}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <div className={`stat-icon ${analysis.weightChange > 0 ? "orange" : "emerald"}`}>
                  {analysis.weightChange > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
              </div>
              <div className="stat-value">{analysis.weightChange > 0 ? "+" : ""}{analysis.weightChange} kg</div>
              <div className="stat-label">Total Weight Change</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-icon blue"><Activity size={18} /></div>
              </div>
              <div className="stat-value">{analysis.weeklyRate} kg</div>
              <div className="stat-label">Weekly Rate</div>
            </div>
            {analysis.avgDietAdherence !== undefined && (
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className={`stat-icon ${analysis.avgDietAdherence >= 80 ? "emerald" : "orange"}`}>
                    <Salad size={18} />
                  </div>
                </div>
                <div className="stat-value">{analysis.avgDietAdherence}%</div>
                <div className="stat-label">Diet Adherence</div>
              </div>
            )}
            {analysis.avgWorkoutAdherence !== undefined && (
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className={`stat-icon ${analysis.avgWorkoutAdherence >= 80 ? "emerald" : "orange"}`}>
                    <Dumbbell size={18} />
                  </div>
                </div>
                <div className="stat-value">{analysis.avgWorkoutAdherence}%</div>
                <div className="stat-label">Workout Adherence</div>
              </div>
            )}
          </section>

          {/* Measurement Changes */}
          {analysis.measurementChanges && (
            <div className="panel">
              <div className="panel-header"><h2 className="panel-title">Body Measurement Changes</h2></div>
              <div className="panel-body">
                <div className="form-grid">
                  {Object.entries(analysis.measurementChanges).map(([key, val]: any) => (
                    <div key={key}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", margin: 0 }}>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p style={{ fontSize: 16, fontWeight: 700, margin: "4px 0 0", color: val > 0 ? "var(--emerald)" : val < 0 ? "var(--red)" : "var(--text)" }}>
                        {val > 0 ? "+" : ""}{val} {key.includes("Cm") ? "cm" : "%"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">AI Recommendations</h2>
                <Brain size={18} style={{ color: "var(--purple)" }} />
              </div>
              <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {analysis.recommendations.map((rec: string, i: number) => (
                  <div key={i} style={{
                    display: "flex", gap: 10, padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg)", border: "1px solid var(--border)",
                    fontSize: 13, color: "var(--text-secondary)",
                  }}>
                    <Brain size={16} style={{ color: "var(--purple)", flexShrink: 0, marginTop: 1 }} />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Calorie Updates */}
          {analysis.suggestedCalories && (
            <div className="ai-insight" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={20} style={{ color: "var(--blue)" }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>Suggested Macro Update</span>
              </div>
              <div className="form-grid" style={{ width: "100%" }}>
                <div>
                  <p className="input-label">Calories</p>
                  <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{analysis.suggestedCalories} kcal</p>
                </div>
                <div>
                  <p className="input-label">Protein</p>
                  <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "var(--blue)" }}>{analysis.suggestedProteinG}g</p>
                </div>
                <div>
                  <p className="input-label">Carbs</p>
                  <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "var(--emerald)" }}>{analysis.suggestedCarbsG}g</p>
                </div>
                <div>
                  <p className="input-label">Fats</p>
                  <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "var(--orange)" }}>{analysis.suggestedFatG}g</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm">
                  <Sparkles size={14} /> Regenerate Diet Plan
                </button>
                <button className="btn btn-secondary btn-sm">
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {!analysis && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon"><Brain size={28} /></div>
          <h2 className="empty-state-title">Run AI Analysis</h2>
          <p className="empty-state-text">
            Analyze the client's progress data, weight trends, adherence, and measurements to get AI-powered recommendations for plan adjustments.
          </p>
          <button onClick={runAnalysis} className="btn btn-primary btn-lg">
            <Brain size={18} /> Run Analysis
          </button>
        </div>
      )}
    </div>
  );
}
