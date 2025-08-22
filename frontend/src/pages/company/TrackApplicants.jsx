import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Loader2, Trash2, CheckCircle } from "lucide-react";

const TrackApplicants = () => {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applicants
  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/apply/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setApplicants(res.data))
      .catch((err) => console.error("Error fetching applicants:", err))
      .finally(() => setLoading(false));
  }, [user]);

  // Update status
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/apply/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Delete application
  const handleDelete = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/apply/${appId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setApplicants((prev) => prev.filter((a) => a.id !== appId));
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Track Applicants</h2>

      {applicants.length === 0 ? (
        <p className="text-gray-600">No applicants found.</p>
      ) : (
        <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-purple-900 text-white">
            <tr>
              <th className="px-4 py-2">Candidate</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Job Title</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Applied At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-2">{a.candidate_name}</td>
                <td className="px-4 py-2">{a.candidate_email}</td>
                <td className="px-4 py-2">{a.job_title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      a.status === "applied"
                        ? "bg-blue-100 text-blue-800"
                        : a.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(a.applied_at).toLocaleString()}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(a.id, "accepted")}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    <CheckCircle size={16} /> Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(a.id, "rejected")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrackApplicants;
