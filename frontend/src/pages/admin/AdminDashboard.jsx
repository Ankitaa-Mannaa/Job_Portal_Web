// src/pages/admin/AdminDashboard.jsx
import { Link } from "react-router-dom";
import { Users, Briefcase, FileText, Download } from "lucide-react";
import AdminDropoffAnalytics from "./AdminDropoffAnalytics";
import quick from "../../assets/user card.jpg";

const quickStats = [
  {
    title: "User Stats",
    description: "Track registered users and activity.",
    path: "/admin/user-stats",
    icon: Users,
    color: "bg-blue-400",
  },
  {
    title: "Job Stats",
    description: "Monitor job postings and applications.",
    path: "/admin/job-stats",
    icon: Briefcase,
    color: "bg-green-400",
  },
  {
    title: "ResumeScoreAnalysis",
    description: "Analyze average resumes and scores of candidates.",
    path: "/admin/resume-scores",
    icon: FileText,
    color: "bg-orange-400",
  },
  {
    title: "Export Reports",
    description: "Export and review analytics reports.",
    path: "/admin/export-reports",  
    icon: Download,
    color: "bg-purple-400",
  },
];

function StatCard({ title, description, path, icon: Icon, color, external }) {
  return (
    <div className="relative">
      {/* Arrow button */}
      <Link
        to={external ? undefined : path}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="absolute -right-2 -top-2 z-20"
      >
        <div className="h-10 w-10 rounded-full bg-white text-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
          </svg>
        </div>
      </Link>

      {/* Shaped card */}
      <div
        className="relative p-8 rounded-3xl shadow-lg text-black hover:text-white overflow-hidden bg-gradient-to-br from-[#f2eaff] to-[#8069b7] hover:from-[#58467a] hover:to-[#7559ad] transform transition-transform duration-300 hover:scale-105"
        style={{ clipPath: "url(#CardClip)" }}
      >
        <div
          className={`h-14 w-14 flex items-center justify-center rounded-full ${color} text-white mb-6 border-2 border-black`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-black hover:text-white font-semibold mt-2">
          {description}
        </p>

        {/* Full card click */}
        {external ? (
          <a
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
            aria-label={title}
          />
        ) : (
          <Link to={path} className="absolute inset-0" aria-label={title} />
        )}
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  return (
    <div className="bg-[#e9cdff] p-4 w-full h-full">
      {/* SVG defs */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <clipPath id="CardClip" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.0029154519, 0.0035335689)"
              d="M0 40C0 17.9086 17.9086 0 40 0H234C253.364 0 269.158 15.2888 269.967 34.4538L270 34.5C270 48.4089 279.661 71.0591 303.397 72H307C326.882 72 343 88.1177 343 108V243C343 265.091 325.091 283 303 283H40C17.9086 283 0 265.091 0 243V40Z"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Intro */}
      <div className="text-center py-4">
  <div className="flex items-center justify-center gap-3 mb-2">
    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 text-white shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    </div>
    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-900 to-violet-700 bg-clip-text text-transparent">
      Admin Dashboard
    </h2>
  </div>
  <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
    Manage your platform with comprehensive analytics, user management, and
    reporting tools
  </p>
</div>

      {/* Row 1 → Shaped cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10 items-stretch">
        {/* Left half */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {quickStats.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* Right half */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg flex items-center justify-center h-full min-h-[400px]">
          <img
            src={quick}
            alt="quick"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <h3 className="text-3xl font-extrabold text-black drop-shadow-lg">
              Access All the Info You Need
            </h3>
            <p className="text-black text-lg italic font-medium mt-3 drop-shadow-md max-w-md">
              Stay on top of user statistics, job postings, resume performance,
              and detailed reports that gives you complete control and clarity
              over your platform.
            </p>
          </div>
        </div>
      </div>

      {/* Row 2 → Manage Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-6">
        <div className="space-y-4">
          <h3 className="text-3xl font-extrabold text-blue-900">
            Manage your platform users
          </h3>
          <p className="text-gray-700 italic font-semibold">
            Keep track of your candidates, company managers, and fellow admins
            with ease. Manage applications, monitor recruiter activities, and
            collaborate seamlessly all from one centralized dashboard.
          </p>
        </div>

        <div className="relative">
          <div className="p-8 rounded-3xl shadow-lg  bg-gradient-to-br from-[#f2eaff] to-[#8069b7] hover:from-[#58467a] hover:to-[#7559ad] text-black hover:text-white relative">
            {/* Arrow button inside card */}
            <Link to="/admin/users" className="absolute top-4 right-4 z-20">
              <div className="h-10 w-10 rounded-full bg-white text-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
            </Link>

            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-indigo-900 border-2 border-black text-white mb-6">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold">Hey Admin, Manage Your Users</h3>
            <p className="text-black font-semibold mt-2">
              View and control all registered users just by clicking the top
              right icon.
            </p>
            <Link to="/admin/users" className="absolute inset-0" aria-label="Manage Users" />
          </div>
        </div>
      </div>

      {/* Row 3 → Drop-off intro */}
      <div className="text-center py-2 mt-6 mb-6">
        <h3 className="text-3xl font-extrabold text-indigo-900">
          Understand Candidate Drop-offs
        </h3>
        <p className="text-gray-700 mt-2 italic font-semibold max-w-3xl mx-auto">
          The chart below shows the exact stages where candidates are leaving
          your hiring funnel. For example, a spike at{" "}
          <span className="font-bold">Resume Upload</span> means many candidates
          are not completing their profile, while a spike at{" "}
          <span className="font-bold">Interview Round </span>
          highlights potential issues with assessments or scheduling. Use these
          insights to improve the process and reduce talent loss.
        </p>
      </div>

      {/* Row 4 → Drop-off Chart */}
      <div className="py-6">
        <h4 className="text-xl font-bold text-center mb-4 text-indigo-800">
          Candidate Drop-off by Recruitment Stage
        </h4>
        <AdminDropoffAnalytics />
      </div>
    </div>
  );
};

export default AdminDashboard;
