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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600 text-lg">
            Share your opportunity with talented professionals
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Job Title Field */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-3 text-lg">
                <svg className="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className="w-full p-4 border-2 border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-3 text-lg">
                <svg className="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
                </svg>
                Job Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the role, requirements, and what makes this opportunity special..."
                className="w-full p-4 border-2 border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md resize-none"
                rows="6"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-8 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-bold text-lg rounded-2xl hover:from-orange-500 hover:to-amber-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Post Job
                </span>
              )}
            </button>

            {/* Message Display */}
            {msg && (
              <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                msg.startsWith("✅") 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                <div className="flex items-center">
                  <span className="text-xl mr-3">
                    {msg.startsWith("✅") ? "✅" : "❌"}
                  </span>
                  <span className="font-medium text-base">
                    {msg.replace(/^[✅❌]\s/, "")}
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Your job posting will be reviewed and published within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostJob;