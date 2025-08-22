import { useEffect, useState } from "react";
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
      fetchJobs(); // 🔥 safer than local merge
    } catch (err) {
      console.error("❌ Update error:", err);
      setMsg("❌ Failed to update job");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/job/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMsg("✅ Job deleted successfully");
      fetchJobs(); // refresh after delete
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMsg("❌ Failed to delete job");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">My Posted Jobs</h1>

      {msg && (
        <p
          className={`mb-4 text-sm font-medium ${
            msg.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      )}

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 border rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              {editingJob === job.id ? (
                <div className="w-full space-y-2">
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(job.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingJob(null)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {job.title}
                    </h2>
                    <p className="text-gray-600">{job.description}</p>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => handleEdit(job)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyViewJobs;
