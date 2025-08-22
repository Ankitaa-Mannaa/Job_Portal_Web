import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, Settings, House, Search, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Logo.jpg";
import { useState } from "react";
import axios from "axios";


const AdminLayout = () => {
  const { user, logout } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <div className="flex h-screen bg-[#e9cdff]">
      {/* Sidebar */}
      <aside className="group fixed left-0 top-0 h-full w-20 hover:w-48 bg-gradient-to-t from-purple-400 to-purple-700 text-white flex flex-col items-center py-6 transition-all duration-300 shadow-lg z-20">
        {/* Logo */}
        <div className="flex flex-col items-center w-full">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 rounded-full mb-10 mx-auto shadow-lg group-hover:scale-110 transition-transform"
          />

          {/* Profile + Settings */}
          <nav className="w-full px-2">
            <Link
              to="/admin/me"
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/admin/me"
                  ? "bg-purple-400/15 text-purple-600 shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-purple-300"
              }`}
            >
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                      <User className="h-5 w-5 text-purple-900" />
                </div>
              <span className="ml-3 text-black hidden group-hover:inline text-sm font-bold">
                Profile
              </span>
            </Link>

            <button
  onClick={() => setShowSettings(true)}
  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
    showSettings ? "bg-purple-500/20 text-black shadow-md scale-105" : "hover:bg-white/20 hover:text-purple-300"
  }`}
>
  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
    <Settings className="h-5 w-5 text-purple-900" />
  </div>
  <span className="ml-3 text-black hidden group-hover:inline text-sm font-bold">
    Settings
  </span>
</button>

            <Link
              to="/admin/export-reports"
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/admin/export-reports"
                  ? "bg-purple-500/20 text-black shadow-md scale-105"
                  : "hover:bg-white/20 hover:text-purple-300"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow shrink-0">
                <Download className="h-5 w-5 text-purple-900" />
              </div>
              <span className="ml-3 text-black hidden group-hover:inline text-sm font-bold">
                Export Reports
              </span>
            </Link>
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

      {/* Main content */}
      <div className="flex-1 ml-20 min-h-screen relative bg-[#e9cdff]">
        {/* Floating Topbar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[95%] bg-gradient-to-r from-purple-800 to-purple-400 text-white shadow-lg rounded-full px-5 py-3 flex items-center justify-between z-10">
          {/* Search */}
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search pages..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-white/30 bg-white/15 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/80" />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-purple-900 shadow hover:scale-110 transition-transform"
              title="Dashboard"
            >
              <House className="h-5 w-5" />
            </button>
            <Link
              to="/admin/me"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-purple-900 shadow hover:scale-110 transition-transform"
              title="My Profile"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
  onClick={() => setShowSettings(true)}
  className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-purple-900 shadow hover:scale-110 transition-transform"
  title="Settings"
>
  <Settings className="h-5 w-5" />
</button>

          </div>
        </div>

        {/* Routed Content */}
        <main className="p-6 pt-24 w-full h-full">
          <Outlet />
        </main>
      </div>
      {showSettings && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
      <h2 className="text-xl font-bold mb-4 text-purple-900">Edit Profile</h2>

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
      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
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

export default AdminLayout;
