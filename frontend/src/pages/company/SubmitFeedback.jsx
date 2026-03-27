import { useState } from "react";
import { MessageSquare, User, Briefcase, Send, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function SubmitFeedback() {
  const { user } = useAuth();
  const [form, setForm] = useState({ user_id: "", job_id: "", feedback: "" });
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/feedback/`,
        form,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      
      setMsg(`✅ ${res.data.msg}`);
      setForm({ user_id: "", job_id: "", feedback: "" });
      setTimeout(() => setMsg(""), 5000);
    } catch (err) {
      console.error(err);
      setMsg("❌ Feedback submission failed.");
      setTimeout(() => setMsg(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Submit Feedback
          </h1>
          <p className="text-gray-600 text-lg">
            Share your thoughts about candidates and job applications
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Message Alert */}
            {msg && (
              <div className={`mb-6 p-4 rounded-2xl border-2 transition-all duration-300 ${
                msg.startsWith("✅") 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${
                    msg.startsWith("✅") ? "bg-green-200" : "bg-red-200"
                  }`}>
                    <CheckCircle size={16} className={
                      msg.startsWith("✅") ? "text-green-600" : "text-red-600"
                    } />
                  </div>
                  <span className="font-medium">{msg.replace(/^[✅❌]\s/, "")}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* User ID Field */}
              <div className="group">
                <label className="flex items-center text-gray-700 font-semibold mb-3 text-lg">
                  <div className="p-2 bg-orange-100 rounded-xl mr-3">
                    <User className="w-5 h-5 text-orange-500" />
                  </div>
                  Candidate User ID
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter the candidate's user ID"
                    value={form.user_id}
                    onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                    required
                    className="w-full p-4 pl-5 border-2 border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md"
                  />
                  <div className="absolute top-4 right-4 text-orange-300">
                    <User size={20} />
                  </div>
                </div>
              </div>

              {/* Job ID Field */}
              <div className="group">
                <label className="flex items-center text-gray-700 font-semibold mb-3 text-lg">
                  <div className="p-2 bg-orange-100 rounded-xl mr-3">
                    <Briefcase className="w-5 h-5 text-orange-500" />
                  </div>
                  Job ID
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter the job ID"
                    value={form.job_id}
                    onChange={(e) => setForm({ ...form, job_id: e.target.value })}
                    required
                    className="w-full p-4 pl-5 border-2 border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md"
                  />
                  <div className="absolute top-4 right-4 text-orange-300">
                    <Briefcase size={20} />
                  </div>
                </div>
              </div>

              {/* Feedback Field */}
              <div className="group">
                <label className="flex items-center text-gray-700 font-semibold mb-3 text-lg">
                  <div className="p-2 bg-orange-100 rounded-xl mr-3">
                    <MessageSquare className="w-5 h-5 text-orange-500" />
                  </div>
                  Your Feedback
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Share your detailed feedback about the candidate's application, interview performance, or any other relevant observations..."
                    value={form.feedback}
                    onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                    required
                    rows="6"
                    className="w-full p-4 pl-5 border-2 border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md resize-none"
                  />
                </div>
                <div className="mt-2 text-right">
                  <span className="text-sm text-gray-400">
                    {form.feedback.length} characters
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative overflow-hidden py-4 px-8 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-bold text-lg rounded-2xl hover:from-orange-500 hover:to-amber-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Feedback...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Feedback
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Your feedback helps improve the hiring process and candidate experience
          </p>
        </div>
      </div>
    </div>
  );
}