import { useEffect, useState } from "react";
import { Briefcase, Edit3, Save, X, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CompanyViewJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [msg, setMsg] = useState("");

  // Fetch jobs (backend already filters for company)
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    if (user?.token) fetchJobs();
  }, [user]);

  const handleEdit = (job) => {
    setEditingJob(job.id);
    setForm({ title: job.title, description: job.description });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/job/${id}`,
        form,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMsg("✅ Job updated successfully");
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error("❌ Update error:", err);
      setMsg("❌ Failed to update job");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/job/${id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMsg("✅ Job deleted successfully");
        fetchJobs();
      } catch (err) {
        console.error("❌ Delete error:", err);
        setMsg("❌ Failed to delete job");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  My Posted Jobs
                </h1>
                <p className="text-gray-600 mt-1">Manage and edit your job listings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-orange-500">{jobs.length}</p>
              <p className="text-sm text-gray-600">Total Jobs</p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {msg && (
          <div className={`mb-6 p-4 rounded-2xl border-2 shadow-lg transition-all duration-300 ${
            msg.startsWith("✅") 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {msg.startsWith("✅") ? "✅" : "❌"}
              </span>
              <span className="font-medium">{msg.replace(/^[✅❌]\s/, "")}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {jobs.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <Briefcase className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Jobs Posted Yet</h3>
            <p className="text-gray-600 text-lg mb-6">Start by creating your first job listing to attract talented candidates.</p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              <Plus size={20} />
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Job ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Title</th>
                    <th className="px-6 py-4 text-left font-semibold">Description</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, idx) => (
                    <tr
                      key={job.id}
                      className={`border-t border-orange-100 ${
                        idx % 2 === 0 ? "bg-white/50" : "bg-orange-50/30"
                      } hover:bg-orange-100/50 transition-all duration-200`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">
                            {job.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingJob === job.id ? (
                          <input
                            type="text"
                            value={form.title}
                            onChange={(e) =>
                              setForm({ ...form, title: e.target.value })
                            }
                            className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-200 bg-white"
                            placeholder="Enter job title"
                          />
                        ) : (
                          <div className="font-semibold text-gray-800 text-lg">
                            {job.title}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        {editingJob === job.id ? (
                          <textarea
                            value={form.description}
                            onChange={(e) =>
                              setForm({ ...form, description: e.target.value })
                            }
                            rows="4"
                            className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-200 bg-white resize-none"
                            placeholder="Enter job description"
                          />
                        ) : (
                          <div className="text-gray-600 line-clamp-3">
                            {job.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {editingJob === job.id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(job.id)}
                                className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <Save size={16} />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingJob(null)}
                                className="inline-flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <X size={16} />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(job)}
                                className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <Edit3 size={16} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(job.id)}
                                className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </>
                          )}
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
            Manage your job postings effectively to attract the best candidates
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyViewJobs;