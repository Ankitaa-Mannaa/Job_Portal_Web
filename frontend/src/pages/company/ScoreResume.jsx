import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Target,
  User,
  Briefcase,
  TrendingUp,
  Zap,
  RefreshCw,
} from "lucide-react";

export default function ScoreResume() {
  const { user } = useAuth();

  const [form, setForm] = useState({ user_id: "", job_id: "" });
  const [score, setScore] = useState(null);
  const [taskId, setTaskId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Vite-style env var (your project uses Vite)
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setScore(null);
    setError("");
    setTaskId("");

    const user_id = parseInt(form.user_id, 10);
    const job_id = parseInt(form.job_id, 10);

    if (isNaN(user_id) || isNaN(job_id)) {
      setError("Please enter valid numbers for Candidate User ID and Job ID.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/resume/score`,
        { user_id, job_id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      // handle both sync and async responses
      if (res.data?.score !== undefined) {
        setScore(res.data.score);
      } else if (res.data?.task_id) {
        setTaskId(res.data.task_id);
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Scoring failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ user_id: "", job_id: "" });
    setScore(null);
    setTaskId("");
    setError("");
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-orange-50 to-orange-100/50 py-8 px-4">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 mb-4 shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Resume Scoring
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get intelligent match scores between candidate resumes and job requirements using advanced AI analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-orange-100 shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Score Analysis</h2>
                  <p className="text-sm text-gray-500">Enter candidate and job details</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Candidate ID Input */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <User className="h-4 w-4 text-orange-600" />
                      Candidate User ID
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                        placeholder="e.g., 42"
                        value={form.user_id}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, user_id: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Job ID Input */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Briefcase className="h-4 w-4 text-orange-600" />
                      Job ID
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                        placeholder="e.g., 101"
                        value={form.job_id}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, job_id: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Generate Score
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* Score Display */}
            {score !== null && (
              <div className={`rounded-3xl border shadow-xl p-6 ${getScoreBackground(score)}`}>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <TrendingUp className={`h-8 w-8 ${getScoreIcon(score)}`} />
                      </div>
                      <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Match Score</h3>
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
                    {score}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {score >= 80 ? "Excellent Match" : 
                     score >= 60 ? "Good Match" : 
                     "Needs Improvement"}
                  </div>
                </div>
              </div>
            )}

            {/* Task Status */}
            {taskId && (
              <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-800 mb-1">Processing</h3>
                    <p className="text-sm text-amber-700 mb-3">
                      Your scoring request is being processed in the background.
                    </p>
                    <div className="bg-amber-200/50 rounded-lg p-3">
                      <p className="text-xs font-mono text-amber-800 break-all">
                        Task ID: {taskId}
                      </p>
                    </div>
                    <p className="text-xs text-amber-600 mt-2 opacity-80">
                      Check back in a few moments for results.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 shadow-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-red-800 mb-1">Error</h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Panel */}
            {!score && !taskId && !error && (
              <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-lg p-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How it works</h3>
                    <div className="text-left space-y-3 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                        <p>Enter the candidate's user ID and the target job ID</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                        <p>Our platform evaluates resumes using a Rule + ML-based scoring engine</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                        <p>Get an instant compatibility score from 0-100%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}