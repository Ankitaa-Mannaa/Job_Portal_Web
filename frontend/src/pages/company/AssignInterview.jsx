import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Calendar,
  Users,
  Briefcase,
  CheckCircle,
  FileText,
  User,
  ChevronDown,
  Loader2,
} from "lucide-react";

export default function AssignInterview() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]); // applications for this HR's jobs
  const [form, setForm] = useState({ job_id: "", user_id: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load HR's jobs and all applicants to those jobs
  useEffect(() => {
    if (!user?.token) return;

    setLoading(true);
    const headers = { Authorization: `Bearer ${user.token}` };
    const base = import.meta.env.VITE_API_BASE_URL;

    Promise.all([
      axios.get(`${base}/api/job/`, { headers }),       // returns only this HR's jobs
      axios.get(`${base}/api/apply/all`, { headers }),  // already filtered by posted_by in backend
    ])
      .then(([jobsRes, appsRes]) => {
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
        setApps(Array.isArray(appsRes.data) ? appsRes.data : []);
      })
      .catch((err) => console.error("Load failed:", err))
      .finally(() => setLoading(false));
  }, [user]);

  // Candidates who applied to the selected job
  const candidatesForSelectedJob = useMemo(() => {
    if (!form.job_id) return [];
    const jId = Number(form.job_id);
    return (apps || [])
      .filter((a) => a.job_id === jId)
      .map((a) => ({
        user_id: a.user_id,
        name: a.candidate_name,
        email: a.candidate_email,
      }));
  }, [apps, form.job_id]);

  // When job changes, reset candidate + messages/questions
  const onJobChange = (job_id) => {
    setForm({ job_id, user_id: "" });
    setQuestions([]);
    setMsg("");
  };

  const onCandidateChange = (user_id) => {
    setForm((f) => ({ ...f, user_id }));
    setQuestions([]);
    setMsg("");
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    setQuestions([]);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/interview/assign`,
        { job_id: Number(form.job_id), user_id: Number(form.user_id) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMsg(`✅ ${res.data?.msg || "Assigned"}`);
      setQuestions(Array.isArray(res.data?.questions) ? res.data.questions : []);
      setTimeout(() => setMsg(""), 5000);
    } catch (err) {
      const apiMsg = err?.response?.data?.msg || err.message || "Assignment failed";
      setMsg(`❌ ${apiMsg}`);
      setTimeout(() => setMsg(""), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-600 font-medium">Loading interview data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Assign Interview
          </h1>
          <p className="text-gray-600 text-lg">
            Schedule interviews and generate tailored questions for candidates
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 p-8">
              {/* Message Alert */}
              {msg && (
                <div
                  className={`mb-6 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    msg.startsWith("✅")
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      size={20}
                      className={msg.startsWith("✅") ? "text-green-600" : "text-red-600"}
                    />
                    <span className="font-medium">{msg.replace(/^[✅❌]\s/, "")}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleAssign} className="space-y-8">
                {/* Job Selection */}
                <div className="group">
                  <label className="flex items-center text-gray-700 font-semibold mb-3 text-lg">
                    <div className="p-2 bg-orange-100 rounded-xl mr-3">
                      <Briefcase className="w-5 h-5 text-orange-500" />
                    </div>
                    Select Job Position
                  </label>
                  <div className="relative">
                    <select
                      value={form.job_id}
                      onChange={(e) => onJobChange(e.target.value)}
                      required
                      className="w-full p-4 pl-5 pr-12 border-2 border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-300 bg-white text-gray-800 shadow-sm hover:shadow-md appearance-none"
                    >
                      <option value="">Choose a job position</option>
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} (ID: {j.id})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-orange-400 pointer-events-none" />
                  </div>
                </div>

                {/* Candidate Selection */}
                <div className="group">
                  <label className="flex items-center text-gray-700 font-semibold mb-3 text-lg">
                    <div className="p-2 bg-orange-100 rounded-xl mr-3">
                      <User className="w-5 h-5 text-orange-500" />
                    </div>
                    Select Candidate
                  </label>
                  <div className="relative">
                    <select
                      value={form.user_id}
                      onChange={(e) => onCandidateChange(e.target.value)}
                      required
                      disabled={!form.job_id}
                      className="w-full p-4 pl-5 pr-12 border-2 border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-300 bg-white text-gray-800 shadow-sm hover:shadow-md appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">
                        {form.job_id ? "Choose a candidate" : "Select job first"}
                      </option>
                      {candidatesForSelectedJob.map((c) => (
                        <option key={`${c.user_id}-${form.job_id}`} value={c.user_id}>
                          {c.name} — {c.email} (ID: {c.user_id})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-orange-400 pointer-events-none" />
                  </div>
                  {form.job_id && candidatesForSelectedJob.length === 0 && (
                    <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                      <Users size={16} />
                      No applicants found for this job position.
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!form.job_id || !form.user_id || submitting}
                    className="w-full relative overflow-hidden py-4 px-8 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-bold text-lg rounded-2xl hover:from-orange-500 hover:to-amber-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin w-5 h-5" />
                          Assigning Interview...
                        </>
                      ) : (
                        <>
                          <Calendar size={20} />
                          Assign Questions & Schedule
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Stats/Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-500" />
                Interview Stats
              </h3>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600">{jobs.length}</div>
                  <div className="text-sm text-gray-600">Available Jobs</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{apps.length}</div>
                  <div className="text-sm text-gray-600">Total Applications</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                  <div className="text-2xl font-bold text-green-600">
                    {candidatesForSelectedJob.length}
                  </div>
                  <div className="text-sm text-gray-600">Candidates for Selected Job</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <h4 className="font-semibold text-gray-800 mb-2">💡 Quick Tip</h4>
                <p className="text-sm text-gray-600">
                  AI-generated questions will be tailored based on the job requirements and candidate profile.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Questions Section */}
        {questions.length > 0 && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-7 h-7" />
                Generated Interview Questions
              </h3>
              <p className="text-orange-100 mt-1">
                Tailored questions for this candidate and position
              </p>
            </div>

            <div className="p-8">
              <div className="grid gap-4">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium leading-relaxed">{q}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Questions Successfully Generated!</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  These questions have been saved and the candidate will be notified about the interview.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Interview assignments help streamline your hiring process
          </p>
        </div>
      </div>
    </div>
  );
}
