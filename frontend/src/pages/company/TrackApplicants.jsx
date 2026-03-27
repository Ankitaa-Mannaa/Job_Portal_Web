import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Loader2,
  Trash2,
  Users,
  CheckCircle,
  Clock,
  Eye,
  UserCheck,
} from "lucide-react";

const STATUS_OPTIONS = ["applied", "reviewing", "interview", "rejected", "hired"];

const STATUS_COLORS = {
  applied: "bg-blue-100 text-blue-800 border-blue-200",
  reviewing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  interview: "bg-purple-100 text-purple-800 border-purple-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  hired: "bg-green-100 text-green-800 border-green-200",
};

const STATUS_ICONS = {
  applied: Clock,
  reviewing: Eye,
  interview: Users,
  rejected: Trash2,
  hired: UserCheck,
};

const TrackApplicants = () => {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [message, setMessage] = useState("");

  // Fetch applicants from backend
  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/apply/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setApplicants(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching applicants:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleStatusChange = (appId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [appId]: newStatus }));
  };

  const handleUpdateStatus = async (appId) => {
    const newStatus = statusUpdates[appId];
    if (!newStatus) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/apply/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      setMessage(`✅ Updated application ${appId} → ${newStatus}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update status:", err);
      setMessage(`❌ Failed to update application ${appId}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/apply/${appId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setApplicants((prev) => prev.filter((a) => a.id !== appId));
      setMessage(`🗑️ Application ${appId} deleted`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete application:", err);
      setMessage(`❌ Failed to delete application ${appId}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getStats = () => {
    const stats = STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = applicants.filter((a) => a.status === status).length;
      return acc;
    }, {});
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-600 font-medium">Loading applicants...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Manage & Track your Applicants
              </h1>
              <p className="text-gray-600 mt-1">Manage and track your job applications</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {STATUS_OPTIONS.map((status) => {
              const StatusIcon = STATUS_ICONS[status];
              return (
                <div
                  key={status}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${STATUS_COLORS[status]}`}>
                      <StatusIcon size={16} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stats[status]}</p>
                      <p className="text-sm text-gray-600 capitalize">{status}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl border-2 shadow-lg transition-all duration-300 ${
              message.startsWith("✅") || message.startsWith("🗑️")
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {applicants.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <Users className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Applicants Yet</h3>
            <p className="text-gray-600 text-lg">
              Applications will appear here once candidates start applying to your jobs.
            </p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Candidate</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">User ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Position</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Applied</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((a, idx) => (
                    <tr
                      key={a.id}
                      className={`border-t border-orange-100 ${
                        idx % 2 === 0 ? "bg-white/50" : "bg-orange-50/30"
                      } hover:bg-orange-100/50 transition-all duration-200`}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">
                          {a.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                            {a.candidate_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="font-semibold text-gray-800">
                            {a.candidate_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{a.candidate_email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {a.user_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {a.job_title || a.job_id}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={statusUpdates[a.id] || a.status}
                          onChange={(e) => handleStatusChange(a.id, e.target.value)}
                          className="border-2 border-orange-200 px-3 py-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-200 bg-white text-gray-800 font-medium"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="capitalize">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(a.applied_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(a.id)}
                            disabled={!statusUpdates[a.id] || statusUpdates[a.id] === a.status}
                            className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 disabled:from-gray-300 disabled:to-gray-300 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                            title="Delete Application"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Total Applications:{" "}
            <span className="font-semibold text-gray-700">{applicants.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackApplicants;
