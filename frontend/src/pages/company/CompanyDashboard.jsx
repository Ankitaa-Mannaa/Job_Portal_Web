// src/pages/company/CompanyDashboard.jsx
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileText,
  ClipboardList,
  PlusCircle,
  ChevronRight,
  TrendingUp,
  CalendarCheck2,
  UserPlus,
} from "lucide-react";

const Stat = ({ icon: Icon, label, value, sub }) => (
  <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 hover:shadow-md transition">
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

const ActionCard = ({ to, icon: Icon, title, desc }) => (
  <Link
    to={to}
    className="group bg-gradient-to-br from-orange-600 to-orange-500 text-white rounded-2xl p-5 shadow hover:shadow-lg transition"
  >
    <div className="flex items-center justify-between">
      <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <ChevronRight className="h-5 w-5 opacity-80 group-hover:translate-x-0.5 transition" />
    </div>
    <div className="mt-4 text-lg font-semibold">{title}</div>
    <p className="text-white/90 text-sm mt-1">{desc}</p>
  </Link>
);

const RowItem = ({ title, meta, right, to }) => {
  const content = (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{meta}</div>
      </div>
      <div className="text-sm text-gray-600">{right}</div>
    </div>
  );
  return to ? (
    <Link
      to={to}
      className="block border-b last:border-b-0 border-gray-100 hover:bg-orange-50/40 rounded-lg px-3 -mx-3"
    >
      {content}
    </Link>
  ) : (
    <div className="border-b last:border-b-0 border-gray-100">{content}</div>
  );
};

export default function CompanyDashboard() {
  // TODO: Replace sample numbers with API data.
  const kpi = {
    openJobs: 6,
    totalApplicants: 142,
    interviewsThisWeek: 12,
    feedbackPending: 9,
  };

  const recentJobs = [
    { id: 41, title: "Frontend Engineer", posted: "2 days ago", applicants: 28 },
    { id: 39, title: "Data Analyst", posted: "4 days ago", applicants: 19 },
    { id: 37, title: "HR Associate", posted: "1 week ago", applicants: 11 },
  ];

  const recentApplicants = [
    { id: 901, name: "Ananya Verma", role: "Frontend Engineer", stage: "Interview" },
    { id: 892, name: "Sahil Gupta", role: "Data Analyst", stage: "Screening" },
    { id: 888, name: "Riya Sharma", role: "HR Associate", stage: "Applied" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-400 rounded-2xl p-6 text-white shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Company Dashboard</h1>
            <p className="text-white/90 mt-1">
              Post roles, track applicants, schedule interviews, and share feedback.
            </p>
          </div>
          <Link
            to="/company/post-job"
            className="inline-flex items-center gap-2 bg-white text-orange-900 px-4 py-2 rounded-xl font-medium shadow hover:shadow-md"
          >
            <PlusCircle className="h-5 w-5" />
            Post a Job
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat icon={Briefcase} label="Open Jobs" value={kpi.openJobs} sub="Actively hiring" />
        <Stat icon={Users} label="Applicants" value={kpi.totalApplicants} sub="All time" />
        <Stat icon={CalendarCheck2} label="Interviews (7d)" value={kpi.interviewsThisWeek} sub="Scheduled this week" />
        <Stat icon={ClipboardList} label="Feedback Pending" value={kpi.feedbackPending} sub="To be shared" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          to="/company/post-job"
          icon={PlusCircle}
          title="Post a Job"
          desc="Create a new opening with description & requirements."
        />
        <ActionCard
          to="/company/applicants"
          icon={Users}
          title="Track Applicants"
          desc="Review, shortlist, and move candidates between stages."
        />
        <ActionCard
          to="/company/assign-interview"
          icon={FileText}
          title="Assign Interview"
          desc="Create interview rounds and assign screening questions."
        />
      </div>

      {/* Pipeline strip */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Hiring Pipeline (sample)
          </div>
          <Link to="/company/applicants" className="text-sm text-orange-700 hover:underline">
            View pipeline
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { label: "Applied", n: 62 },
            { label: "Screening", n: 38 },
            { label: "Interview", n: 24 },
            { label: "Offer", n: 7 },
          ].map((s) => (
            <div key={s.label} className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div className="text-xs text-orange-700/80 uppercase font-semibold">{s.label}</div>
              <div className="text-2xl font-bold text-gray-900">{s.n}</div>
              <div className="mt-2 h-2 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${Math.min(100, (s.n / 62) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-orange-600" />
              Recent Jobs
            </div>
            <Link to="/company/view-jobs" className="text-sm text-orange-700 hover:underline">
              View all jobs
            </Link>
          </div>
          <div className="mt-3 divide-y divide-gray-100">
            {recentJobs.map((j) => (
              <RowItem
                key={j.id}
                title={j.title}
                meta={`Posted ${j.posted}`}
                right={`${j.applicants} applicants`}
                to={`/company/view-jobs?highlight=${j.id}`}
              />
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-orange-600" />
              Recent Applicants
            </div>
            <Link to="/company/applicants" className="text-sm text-orange-700 hover:underline">
              Manage applicants
            </Link>
          </div>
          <div className="mt-3 divide-y divide-gray-100">
            {recentApplicants.map((a) => (
              <RowItem
                key={a.id}
                title={a.name}
                meta={`Applied for ${a.role}`}
                right={a.stage}
                to={`/company/applicants?candidate=${a.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
