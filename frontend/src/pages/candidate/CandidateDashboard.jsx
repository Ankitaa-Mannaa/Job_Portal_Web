// src/pages/candidate/CandidateDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Upload,
  Briefcase,
  MessageCircle,
  FileText,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Building2,
  Eye,
  ClipboardList,
  X,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const [apps, setApps] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [assignedCount, setAssignedCount] = useState(0);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (!user?.token) return;
    const headers = { Authorization: `Bearer ${user.token}` };

    const fetchRecommendations = axios
      .get(`${API}/api/resume/recommendations`, { headers })
      .then((r) => setRecs(Array.isArray(r.data) ? r.data : []))
      .catch(() => setRecs([]));

    const fetchApplications = axios
      .get(`${API}/api/apply/my`, { headers })
      .then((r) => setApps(Array.isArray(r.data) ? r.data : []))
      .catch(() => setApps([]));

    const fetchFeedbacks = axios
      .get(`${API}/api/feedback/my`, { headers })
      .then((r) => setFeedbacks(Array.isArray(r.data) ? r.data : []))
      .catch(() => setFeedbacks([]));

    // count how many jobs have assigned interview questions
    const fetchAssignedCount = axios
      .get(`${API}/api/apply/my`, { headers })
      .then(async (res) => {
        const apps = Array.isArray(res.data) ? res.data : [];
        let count = 0;
        for (const app of apps) {
          try {
            const r = await axios.get(`${API}/api/interview/assigned/${app.job_id}`, { headers });
            if (r.data.questions && r.data.questions.length > 0) count++;
          } catch {
            /* ignore */
          }
        }
        setAssignedCount(count);
      })
      .catch(() => setAssignedCount(0));

    Promise.all([fetchRecommendations, fetchApplications, fetchFeedbacks, fetchAssignedCount])
      .catch(() => setError("Failed to load some data"))
      .finally(() => setLoading(false));
  }, [user]);

  const stats = useMemo(() => {
    const totalApps = apps.length;
    const statusCounts = apps.reduce(
      (acc, a) => {
        const s = (a.status || "").toLowerCase();
        if (s.includes("short") || s.includes("select")) acc.shortlisted += 1;
        else if (s.includes("reject")) acc.rejected += 1;
        else acc.pending += 1;
        return acc;
      },
      { pending: 0, shortlisted: 0, rejected: 0 }
    );
    return {
      totalApps,
      recommended: recs.length,
      pending: statusCounts.pending,
      shortlisted: statusCounts.shortlisted,
    };
  }, [apps, recs]);

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute"></div>
          <div className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Welcome back!
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Track your applications, discover AI-matched opportunities, and accelerate your career journey.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-row gap-3">
                <ActionButton to="/candidate/upload-resume" icon={Upload} label="Upload Resume" variant="primary" />
                <ActionButton to="/candidate/ai-chat" icon={MessageCircle} label="AI Assistant" variant="secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="AI Matches" value={loading ? "—" : stats.recommended} icon={Sparkles} gradient="from-purple-500 to-pink-500" trend="+12%" subtitle="This week" />
          <StatCard title="Applications" value={loading ? "—" : stats.totalApps} icon={Briefcase} gradient="from-blue-500 to-cyan-500" trend="+8%" subtitle="Total sent" />
          <StatCard title="In Review" value={loading ? "—" : stats.pending} icon={Clock3} gradient="from-amber-500 to-orange-500" trend={`${stats.pending} active`} subtitle="Pending" />
          <StatCard title="Shortlisted" value={loading ? "—" : stats.shortlisted} icon={CheckCircle2} gradient="from-emerald-500 to-teal-500" trend={`+${stats.shortlisted} new`} subtitle="Great progress!" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* AI Matches */}
          <div className="xl:col-span-2 space-y-6">
            <Panel title="AI-Matched Jobs for You" subtitle="Curated opportunities based on your profile" actionLabel="View All Matches" onAction={() => navigate("/candidate/matched-jobs")} icon={Sparkles}>
              {loading ? (
                <ListSkeleton />
              ) : recs.length === 0 ? (
                <EmptyState icon={FileText} title="No recommendations yet" desc="Upload your resume to get AI-powered job matches tailored for you." cta={{ label: "Upload Resume", to: "/candidate/upload-resume" }} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recs.slice(0, 3).map((job, idx) => (
                    <JobCard key={job.id || idx} job={job} onClick={() => job.id && navigate(`/job/${job.id}`)} />
                  ))}
                </div>
              )}
            </Panel>

            {/* Browse Jobs Card */}
            <Panel title="Browse Jobs" subtitle="Explore all available opportunities" icon={Briefcase}>
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/20 flex items-center justify-center mb-3">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  </div>
                <p className="text-gray-600 mb-4">Check out all jobs posted by companies and start applying.</p>
                <Link
                  to="/candidate/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Browse Jobs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Panel>
          </div>

          {/* Sidebar Panels */}
          <div className="space-y-6">
            {/* Applications */}
            <Panel title="Recent Applications" subtitle="Track your application status" actionLabel="View All" onAction={() => navigate("/candidate/applications")} icon={Briefcase} compact>
              {loading ? (
                <ListSkeleton compact />
              ) : apps.length === 0 ? (
                <EmptyState icon={Briefcase} title="No applications yet" desc="Start applying to jobs to track your progress here." cta={{ label: "Browse Jobs", to: "/candidate/jobs" }} compact />
              ) : (
                <div className="space-y-3">
                  {apps.slice(0, 3).map((app) => (
                    <ApplicationCard key={app.application_id} app={app} />
                  ))}
                </div>
              )}
            </Panel>

            {/* Feedback */}
            <Panel title="Recent Feedback" subtitle="Company responses and updates" actionLabel="View All" onAction={() => navigate("/candidate/feedback")} icon={MessageCircle} compact>
              {loading ? (
                <ListSkeleton compact />
              ) : feedbacks.length === 0 ? (
                <EmptyState icon={AlertCircle} title="No feedback yet" desc="You'll see company responses here." compact />
              ) : (
                <div className="space-y-3">
                  {feedbacks.slice(0, 3).map((feedback, idx) => (
                    <FeedbackCard key={idx} feedback={feedback} />
                  ))}
                </div>
              )}
            </Panel>

            {/* Assigned Questions */}
            <Panel title="Interview Questions" subtitle="Questions assigned to you" actionLabel="View All" onAction={() => navigate("/candidate/assigned-questions")} icon={ClipboardList} compact>
              {loading ? (
                <ListSkeleton compact />
              ) : assignedCount === 0 ? (
                <EmptyState icon={ClipboardList} title="No assignments yet" desc="You'll see assigned interview questions here." compact />
              ) : (
                <div className="text-center py-2">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{assignedCount}</p>
                  <p className="text-sm text-gray-600">Assignments Assigned</p>
                  <p className="text-xs text-green-600 mt-1">Ready to practice!</p>
                </div>
              )}
            </Panel>
          </div>
        </div>

        {/* Activity Feed */}
        <Panel title="Recent Activity" subtitle="Your latest career activities" icon={TrendingUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActivityCard icon={Upload} title="Resume Updated" desc="Your resume was successfully uploaded" time="2 days ago" color="blue" />
            <ActivityCard icon={Eye} title="Profile Viewed" desc={`${apps.length} employers viewed your profile`} time="1 week ago" color="green" />
            <ActivityCard icon={Star} title="New Matches" desc={`${recs.length} jobs match your profile`} time="3 days ago" color="purple" />
          </div>
        </Panel>

        {/* Job Modal */}
        {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}

        {/* Error banner */}
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-6 py-4 shadow-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function ActionButton({ to, icon: Icon, label, variant = "secondary" }) {
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
    secondary: "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200/50",
  };
  return (
    <Link to={to} className={`${baseClasses} ${variants[variant]}`}>
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

function StatCard({ title, value, icon: Icon, gradient, trend, subtitle }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, actionLabel, onAction, children, icon: Icon, compact = false }) {
  return (
    <div className="group h-fit">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100/50 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
              </div>
            </div>
            {actionLabel && onAction && (
              <button onClick={onAction} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                {actionLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className={compact ? "p-4" : "p-6"}>{children}</div>
      </div>
    </div>
  );
}

function JobCard({ job, onClick }) {
  return (
    <div onClick={onClick} className="group relative bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200/50 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title || `Job #${job.id || "Unknown"}`}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{job.company || "Company not specified"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {job.match && <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">{job.match}% match</span>}
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{job.description || "No description available."}</p>
    </div>
  );
}

function ApplicationCard({ app, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer group">
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
        <Briefcase className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{app.job_title || `Job #${app.job_id}`}</p>
        <p className="text-xs text-gray-500">{app.company_name || "Company not specified"}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusPill status={app.status} />
      </div>
    </div>
  );
}

function FeedbackCard({ feedback }) {
  return (
    <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100/50">
      <p className="font-medium text-gray-900 text-sm mb-1">{feedback.job_title || `Job #${feedback.job_id}`}</p>
      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{feedback.feedback}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{feedback.posted_by || "Unknown"}</span>
        <span>{feedback.created_at ? new Date(feedback.created_at).toLocaleDateString() : "Date unknown"}</span>
      </div>
    </div>
  );
}

function ActivityCard({ icon: Icon, title, desc, time, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };
  return (
    <div className="flex items-center gap-4 p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-colors">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-600">{desc}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const s = (status || "pending").toLowerCase();
  const variants = {
    applied: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    shortlisted: "bg-green-100 text-green-700 border-green-200",
    selected: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };
  const getStyle = () => {
    if (s.includes("reject")) return variants.rejected;
    if (s.includes("short") || s.includes("select")) return variants.shortlisted;
    if (s.includes("applied")) return variants.applied;
    return variants.pending;
  };
  return <span className={`inline-block text-xs px-2 py-1 rounded-full border font-medium ${getStyle()}`}>{status || "pending"}</span>;
}

function ListSkeleton({ compact = false }) {
  const count = compact ? 3 : 3;
  const height = compact ? "h-12" : "h-16";
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${height} rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse`} />
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, cta, compact = false }) {
  return (
    <div className={`text-center ${compact ? "py-6" : "py-12"}`}>
      <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      {desc && <p className="text-sm text-gray-600 mb-4">{desc}</p>}
      {cta && (
        <Link to={cta.to} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
          {cta.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

function JobModal({ job, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{job.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <p>{job.description}</p>
      </div>
    </div>
  );
}
