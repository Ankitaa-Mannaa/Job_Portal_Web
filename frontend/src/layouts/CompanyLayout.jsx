import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  House,
  Briefcase,
  Users,
  ClipboardList,
  FileText,
  CalendarCheck2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Logo.jpg";
import { useState } from "react";
import axios from "axios";

const CompanyLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-full bg-[#fee8d6]">
      {/* Sidebar */}
      <aside className="group fixed left-0 top-0 h-full w-20 hover:w-48 bg-gradient-to-t from-orange-300 to-orange-600 text-white flex flex-col items-center py-6 transition-all duration-300 shadow-lg z-20">
        {/* Logo */}
        <div className="flex flex-col items-center w-full">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 rounded-full mb-10 mx-auto shadow-lg group-hover:scale-110 transition-transform"
          />

          {/* Nav links */}
          <nav className="w-full px-2 space-y-1">
            <Link
              to="/company"
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive("/company")
                  ? "bg-orange-400/20 text-orange-100 shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-orange-200"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                <House className="h-5 w-5 text-orange-900" />
              </div>
              <span className="ml-3 text-white hidden group-hover:inline text-sm font-bold">
                Dashboard
              </span>
            </Link>

            <Link
              to="/company/me"
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive("/company/me")
                  ? "bg-orange-400/20 text-orange-100 shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-orange-200"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                <User className="h-5 w-5 text-orange-900" />
              </div>
              <span className="ml-3 text-white hidden group-hover:inline text-sm font-bold">
                Profile
              </span>
            </Link>

            <Link
              to="/company/post-job"
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive("/company/post-job")
                  ? "bg-orange-400/20 text-orange-100 shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-orange-200"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                <Briefcase className="h-5 w-5 text-orange-900" />
              </div>
              <span className="ml-3 text-white hidden group-hover:inline text-sm font-bold">
                Post a Job
              </span>
            </Link>

            <Link
              to="/company/applicants"
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive("/company/applicants")
                  ? "bg-orange-400/20 text-orange-100 shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-orange-200"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                <Users className="h-5 w-5 text-orange-900" />
              </div>
              <span className="ml-3 text-white hidden group-hover:inline text-sm font-bold">
                Track Applicants
              </span>
            </Link>

            <Link
              to="/company/view-jobs"
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive("/company/view-jobs")
                  ? "bg-orange-400/20 text-orange-100 shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-orange-200"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                <FileText className="h-5 w-5 text-orange-900" />
              </div>
              <span className="ml-3 text-white hidden group-hover:inline text-sm font-bold">
                View Jobs
              </span>
            </Link>

            <Link
              to="/company/feedback"
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive("/company/feedback")
                  ? "bg-orange-400/20 text-orange-100 shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-orange-200"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                <ClipboardList className="h-5 w-5 text-orange-900" />
              </div>
              <span className="ml-3 text-white hidden group-hover:inline text-sm font-bold">
                Submit Feedback
              </span>
            </Link>

            <Link
              to="/company/assign-interview"
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive("/company/assign-interview")
                  ? "bg-orange-400/20 text-orange-100 shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-orange-200"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                <CalendarCheck2 className="h-5 w-5 text-orange-900" />
              </div>
              <span className="ml-3 text-white hidden group-hover:inline text-sm font-bold">
                Assign Interview
              </span>
            </Link>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className={`w-full text-left flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                showSettings
                  ? "bg-orange-400/20 text-orange-100 shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-orange-200"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                <Settings className="h-5 w-5 text-orange-900" />
              </div>
              <span className="ml-3 text-white hidden group-hover:inline text-sm font-bold">
                Settings
              </span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-auto w-full px-2">
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-3 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-200"
          >
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-600 shadow shrink-0">
              <LogOut className="h-7 w-7" />
            </div>
            <span className="ml-3 hidden group-hover:inline text-sm font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-20 min-h-screen relative bg-[#fff9f3]">
        {/* Topbar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[95%] bg-gradient-to-r from-orange-600 to-orange-300 text-white shadow-lg rounded-full px-5 py-3 flex items-center justify-between z-10">
          {/* Search */}
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search jobs or applicants..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-white/30 bg-white/15 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 h-5 w-5 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/company")}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-orange-900 shadow hover:scale-110 transition-transform"
              title="Dashboard"
            >
              <House className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-orange-900 shadow hover:scale-110 transition-transform"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Routed Pages */}
        <main className="p-6 pt-24 w-full h-full">
          <Outlet />
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-orange-900">Edit Profile</h2>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setMsg("");
                try {
                  const res = await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
                    { name, email },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                  );
                  setMsg("✅ " + res.data.msg);
                  setShowSettings(false);
                } catch (err) {
                  setMsg("❌ " + (err.response?.data?.msg || "Update failed"));
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
              {msg && <p className="text-sm mt-2">{msg}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyLayout;
