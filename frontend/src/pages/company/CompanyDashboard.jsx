import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Briefcase,
  Users,
  PlusCircle,
  ChevronRight,
  CalendarCheck2,
  UserPlus,
  MessageSquare,
  Eye,
  AlertCircle,
  Loader2,
  Target
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [interviewCount, setInterviewCount] = useState("—");
  const [pendingFeedback, setPendingFeedback] = useState("—");

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = { Authorization: `Bearer ${user.token}` };

        const jobsPromise = axios
          .get(`${API}/api/job/`, { headers })
          .then((response) => {
            const jobsData = Array.isArray(response.data) ? response.data : [];
            setJobs(jobsData);
            return jobsData;
          })
          .catch((err) => {
            console.error("Jobs fetch failed:", err.response?.data || err.message);
            setJobs([]);
            throw new Error("Failed to fetch jobs");
          });

        const appsPromise = axios
          .get(`${API}/api/apply/all`, { headers })
          .then((response) => {
            const appsData = Array.isArray(response.data) ? response.data : [];
            setApps(appsData);
            return appsData;
          })
          .catch((err) => {
            console.error("Applicants fetch failed:", err.response?.data || err.message);
            setApps([]);
            throw new Error("Failed to fetch applicants");
          });

        const interviewPromise = axios
          .get(`${API}/api/apply/stats/interviews`, { headers })
          .then((res) => setInterviewCount(res.data.total_interviews || 0))
          .catch((err) => {
            console.error("Interview stats fetch failed:", err.response?.data || err.message);
            setInterviewCount(0);
          });

        const feedbackPromise = axios
          .get(`${API}/api/feedback/stats/company`, { headers })
          .then((res) => setPendingFeedback(res.data.pending || 0))
          .catch((err) => {
            console.error("Feedback stats fetch failed:", err.response?.data || err.message);
            setPendingFeedback(0);
          });

        await Promise.allSettled([jobsPromise, appsPromise, interviewPromise, feedbackPromise]);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError("Failed to load dashboard data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate stats
  const totalJobs = jobs.length;
  const totalApplicants = apps.length;
  const recentJobs = jobs.slice().reverse().slice(0, 3);
  const recentApps = apps.slice().reverse().slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-400 rounded-2xl p-6 text-white shadow">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Company Dashboard</h1>
            <p className="text-white/90 mt-1">
              Manage your hiring process end-to-end with our comprehensive tools.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/company/post-job"
              className="inline-flex items-center gap-2 bg-white text-orange-900 px-4 py-2 rounded-xl font-medium shadow hover:shadow-md transition"
            >
              <PlusCircle className="h-5 w-5" />
              Post a Job
            </Link>

            {/* NEW: View Jobs button beside Post Job */}
            <Link
              to="/company/view-jobs"
              className="inline-flex items-center gap-2 bg-white text-orange-900 px-4 py-2 rounded-xl font-medium shadow hover:shadow-md transition"
            >
              <Eye className="h-5 w-5" />
              View Jobs
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Open Jobs"
          value={loading ? "—" : totalJobs}
          sub="Currently active"
        />
        <StatCard
          icon={Users}
          label="Total Applicants"
          value={loading ? "—" : totalApplicants}
          sub="All positions"
        />
        <StatCard
          icon={CalendarCheck2}
          label="Interviews"
          value={loading ? "—" : interviewCount}
          sub="Next 7 days"
        />
        <StatCard
          icon={MessageSquare}
          label="Pending Feedback"
          value={loading ? "—" : pendingFeedback}
          sub="Awaiting review"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1) Manage Applicants — FIRST and PRIMARY (orange) */}
        <ActionCard
          to="/company/applicants"
          icon={Users}
          title="Manage Applicants"
          desc="Review and process candidate applications"
          primary
        />

        {/* 2) Post Job — now non-primary */}
        <ActionCard
          to="/company/post-job"
          icon={PlusCircle}
          title="Post Job"
          desc="Create new job openings with detailed requirements"
        />

        {/* 3) Assign Interview */}
        <ActionCard
          to="/company/assign-interview"
          icon={CalendarCheck2}
          title="Assign Interview"
          desc="Schedule and manage interview rounds"
        />

        {/* 4) Score Resume — replaces View Jobs card */}
        <ActionCard
          to="/company/score-resume"
          icon={Target}
          title="Score Resume"
          desc="Get ML based match score for a candidate"
        />

        {/* 5) Submit Feedback */}
        <ActionCard
          to="/company/feedback"
          icon={MessageSquare}
          title="Submit Feedback"
          desc="Provide feedback on candidates and interviews"
        />
      </div>

      {/* Recent Jobs & Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Jobs */}
        <Panel
          title="Recent Job Postings"
          icon={Briefcase}
          actionLabel="View all jobs"
          onAction={() => navigate("/company/view-jobs")}
        >
          {loading ? (
            <Loader />
          ) : recentJobs.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentJobs.map((job) => (
                <RowItem
                  key={job.id}
                  title={job.title || "Untitled Job"}
                  meta={`Job ID: ${job.id} ${job.company_name ? `• ${job.company_name}` : ""}`}
                  right=""
                  to={`/company/view-jobs?highlight=${job.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={Briefcase} text="No recent jobs posted" />
          )}
        </Panel>

        {/* Recent Applicants */}
        <Panel
          title="Recent Applications"
          icon={UserPlus}
          actionLabel="Manage applicants"
          onAction={() => navigate("/company/applicants")}
        >
          {loading ? (
            <Loader />
          ) : recentApps.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentApps.map((app) => (
                <RowItem
                  key={app.id}
                  title={`Application #${app.id}`}
                  meta={`Job ID: ${app.job_id || "N/A"}`}
                  right={app.status || "Pending"}
                  to={`/company/applicants?candidate=${app.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={Users} text="No recent applications" />
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-orange-700/70 font-semibold">
            {label}
          </div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ to, icon: Icon, title, desc, primary = false }) {
  return (
    <Link
      to={to}
      className={`group rounded-2xl p-5 shadow hover:shadow-lg transition ${
        primary
          ? "bg-gradient-to-br from-orange-600 to-orange-500 text-white"
          : "bg-white border border-orange-100 text-gray-900 hover:border-orange-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center ${
            primary ? "bg-white/15" : "bg-orange-50"
          }`}
        >
          <Icon className={`h-5 w-5 ${primary ? "text-white" : "text-orange-600"}`} />
        </div>
        <ChevronRight
          className={`h-5 w-5 group-hover:translate-x-0.5 transition ${
            primary ? "text-white/80" : "text-gray-400"
          }`}
        />
      </div>
      <div className="mt-4 text-lg font-semibold">{title}</div>
      <p className={`text-sm mt-1 ${primary ? "text-white/90" : "text-gray-600"}`}>{desc}</p>
    </Link>
  );
}

function RowItem({ title, meta, right, to }) {
  return (
    <Link to={to} className="block hover:bg-orange-50/40 rounded-lg px-3 -mx-3 py-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900 truncate">{title}</div>
          <div className="text-xs text-gray-500 truncate">{meta}</div>
        </div>
        <div className="text-sm text-gray-600 ml-2 flex-shrink-0">{right}</div>
      </div>
    </Link>
  );
}

function Panel({ title, icon: Icon, actionLabel, onAction, children }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-gray-900 flex items-center gap-2">
          <Icon className="h-5 w-5 text-orange-600" />
          {title}
        </div>
        {actionLabel && (
          <button onClick={onAction} className="text-sm text-orange-700 hover:underline">
            {actionLabel} →
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex justify-center py-8">
      <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="text-center py-8 text-gray-500">
      <Icon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
