import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { 
  ClipboardList, 
  Briefcase, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Search,
  FileText,
  ArrowRight
} from "lucide-react";

export default function AssignedQuestions() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);            
  const [jobsMap, setJobsMap] = useState({});      
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [msg, setMsg] = useState("");
  const [questions, setQuestions] = useState([]);

  // Load candidate applications, then fetch job titles
  useEffect(() => {
    if (!user?.token) return;
    const base = import.meta.env.VITE_API_BASE_URL;
    const headers = { Authorization: `Bearer ${user.token}` };

    const load = async () => {
      setLoading(true);
      setMsg("");
      try {
        // 1) Candidate's applications
        const appsRes = await axios.get(`${base}/api/apply/my`, { headers });
        const myApps = Array.isArray(appsRes.data) ? appsRes.data : [];
        setApps(myApps);

        // 2) Unique job ids
        const uniqueIds = [...new Set(myApps.map((a) => a.job_id))];

        // 3) Fetch job details (title) for each id
        const jobPairs = await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const jr = await axios.get(`${base}/api/job/${id}`, { headers });
              return [id, jr.data];
            } catch {
              // Fallback if job fetch fails
              return [id, { id, title: `Job #${id}` }];
            }
          })
        );

        const map = jobPairs.reduce((acc, [id, job]) => {
          acc[id] = job;
          return acc;
        }, {});
        setJobsMap(map);
      } catch (e) {
        console.error("Failed to load applications/jobs", e);
        setMsg("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const myJobs = useMemo(() => {
    // build a de‑duplicated list of the candidate's jobs w/ titles
    const ids = [...new Set(apps.map((a) => a.job_id))];
    return ids.map((id) => ({
      id,
      title: jobsMap[id]?.title || `Job #${id}`,
    }));
  }, [apps, jobsMap]);

  const fetchQuestions = async (e) => {
    e.preventDefault();
    if (!jobId) return;
    setFetching(true);
    setMsg("");
    setQuestions([]);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/interview/assigned/${jobId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const list = Array.isArray(res.data?.questions) ? res.data.questions : [];
      setQuestions(list);
      setMsg(list.length ? "Questions loaded successfully" : "No questions assigned yet.");
    } catch (err) {
      const apiMsg = err?.response?.data?.msg;
      if (err?.response?.status === 404 && apiMsg) {
        setMsg(`${apiMsg}`);
      } else {
        setMsg(`Failed to fetch questions`);
      }
    } finally {
      setFetching(false);
    }
  };

  const getMessageIcon = () => {
    if (msg.includes("successfully") || msg.includes("loaded")) return CheckCircle;
    if (msg.includes("No questions") || msg.includes("assigned yet")) return Info;
    return AlertCircle;
  };

  const getMessageColor = () => {
    if (msg.includes("successfully") || msg.includes("loaded")) return "text-green-700 bg-green-50 border-green-200";
    if (msg.includes("No questions") || msg.includes("assigned yet")) return "text-blue-700 bg-blue-50 border-blue-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
              <p className="text-blue-600 font-medium">Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
            Interview Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View questions assigned by employers for your job applications
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Selection Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Select Job</h2>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={fetchQuestions} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Choose from your applications
                    </label>
                    <select
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      required
                      className="w-full border border-blue-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white shadow-sm transition-all duration-200"
                    >
                      <option value="">
                        {myJobs.length ? "Select a job..." : "No applications found"}
                      </option>
                      {myJobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title}
                        </option>
                      ))}
                    </select>
                    {!myJobs.length && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-700 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Apply to jobs first to see assigned questions
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!jobId || fetching}
                    className={`w-full py-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2
                      ${!jobId || fetching 
                        ? "bg-gray-300 cursor-not-allowed" 
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:scale-[1.02]"
                      }
                    `}
                  >
                    {fetching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Loading...
                      </>
                    ) : (
                      <>
                        View Questions
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Message */}
                {msg && (
                  <div className={`mt-6 p-4 rounded-xl border ${getMessageColor()} flex items-start gap-3`}>
                    {(() => {
                      const Icon = getMessageIcon();
                      return <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />;
                    })()}
                    <p className="font-medium text-sm">{msg}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Questions Display */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">Interview Questions</h2>
                  </div>
                  {questions.length > 0 && (
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {questions.length} questions
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question, idx) => (
                      <div
                        key={idx}
                        className="group bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold text-sm">{idx + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium leading-relaxed">{question}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ClipboardList className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Select a job from the dropdown to view assigned interview questions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}