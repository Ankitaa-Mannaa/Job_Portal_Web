import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  FileText,
  Building2,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function MyApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);

    axios
      .get(`${API}/api/apply/my`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setApps(res.data || []))
      .catch(() => setError("Failed to load applications"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (applicationId) => {
    if (!user?.token) return;
    setDeleting(applicationId);
    try {
      await axios.delete(`${API}/api/apply/${applicationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setApps(apps.filter((app) => app.application_id !== applicationId));

      setNotification({
        type: "success",
        message: "Application deleted successfully",
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to delete application",
      });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 bg-[#f3f0ff] min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-900 mb-6">
        My Applications
      </h1>

      {notification && (
        <div
          className={`rounded-lg p-4 mb-6 flex items-center space-x-3 border ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center space-x-2 text-indigo-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading applications...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      ) : apps.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
          You haven’t applied for any jobs yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-indigo-50 text-indigo-900">
              <tr>
                <th className="text-left px-6 py-3">Application ID</th>
                <th className="text-left px-6 py-3">Job Title</th>
                <th className="text-left px-6 py-3">Company</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.application_id} className="border-t">
                  <td className="px-6 py-3">{app.application_id}</td>
                  <td className="px-6 py-3">{app.job_title}</td>
                  <td className="px-6 py-3">{app.company_name}</td>
                  <td className="px-6 py-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700 border border-yellow-200">
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 space-x-3">
                    {/* Details Button */}
                    <button
                      onClick={() => setSelectedJob(app)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Details →
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(app.application_id)}
                      disabled={deleting === app.application_id}
                      className="text-red-600 hover:text-red-800 font-medium inline-flex items-center space-x-1"
                    >
                      {deleting === app.application_id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedJob.job_title}
                </h2>
                <p className="text-sm text-gray-600">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  {selectedJob.company_name}
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              Status: {selectedJob.status}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
