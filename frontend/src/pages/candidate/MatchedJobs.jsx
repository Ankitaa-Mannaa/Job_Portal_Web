import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Loader2,
  RefreshCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

function ScoreBadge({ score }) {
  const hue = Math.max(0, Math.min(120, Math.round((score / 100) * 120))); 
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `hsl(${hue} 80% 92%)`, color: `hsl(${hue} 60% 25%)` }}
    >
      Match {score}%
    </span>
  );
}

function JobCard({ item, onApply, applied }) {
  const { job, score } = item;
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {job.title}
        </h3>
        <ScoreBadge score={Number(score)} />
      </div>

      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
        {job.description}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Search className="w-4 h-4" />
          Job ID: {job.id}
        </span>
        {job.posted_by && <span>• Posted by: {job.posted_by}</span>}
      </div>

      <div className="mt-auto pt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onApply(job.id)}
          disabled={applied || !onApply}
          className={`inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition
            ${applied
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800"}`}
          aria-disabled={applied}
        >
          {applied ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Applied
            </>
          ) : (
            "Apply"
          )}
        </button>

        <details className="ml-auto">
          <summary className="text-sm text-purple-700 hover:text-purple-900 cursor-pointer">
            View details
          </summary>
          <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
            {job.description}
          </div>
        </details>
      </div>
    </div>
  );
}

export default function MatchedJobs() {
  const { user } = useAuth();
  const [data, setData] = useState([]); // [{job, score}]
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const api = useMemo(
    () =>
      axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      }),
    [user?.token]
  );

  const fetchMatches = async () => {
    if (!user?.token) return;
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/resume/recommendations");
      const items = Array.isArray(res.data) ? res.data : [];
      setData(items);
    } catch (e) {
      console.error(e);
      setErr(
        e?.response?.data?.msg ||
          e?.response?.data?.error ||
          "Failed to load recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId) => {
    try {
      await api.post("/api/apply/", { job_id: jobId });
      setAppliedIds((prev) => new Set([...prev, jobId]));
    } catch (e) {
      const msg =
        e?.response?.data?.msg ||
        e?.response?.data?.error ||
        "Failed to apply";
      alert(msg);
    }
  };

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-600">Please log in to view matched jobs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Matched Jobs
            </h1>
            <p className="text-sm text-gray-600">
              Personalized recommendations generated from your resume content and
              rule+ML scoring.
            </p>
          </div>

          <button
            onClick={fetchMatches}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading recommendations…
          </div>
        ) : err ? (
          <div className="bg-white border border-red-200 text-red-700 rounded-xl p-4 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-medium">Could not load matches</div>
              <div className="text-sm">{err}</div>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white border rounded-2xl p-8 text-center text-gray-600">
            No matches yet. Upload your resume or post new jobs to populate
            recommendations.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item) => (
              <JobCard
                key={item.job.id}
                item={item}
                onApply={applyToJob}
                applied={appliedIds.has(item.job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
