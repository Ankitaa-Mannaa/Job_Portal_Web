import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const PostJob = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/job/`,
        form,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMsg("✅ " + res.data.msg);
      setForm({ title: "", description: "" });
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || "Failed to post job"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            rows="5"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>

        {msg && (
          <p
            className={`mt-3 text-sm font-medium ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}
      </form>
    </div>
  );
};

export default PostJob;
