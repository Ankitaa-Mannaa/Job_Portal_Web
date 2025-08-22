import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Loader2,
  AlertCircle,
  FileText,
  Building2,
  User,
  Calendar,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Feedback() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) return;

    setLoading(true);
    axios
      .get(`${API}/api/feedback/my`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setFeedbacks(res.data || []))
      .catch(() => setError("Failed to load feedback"))
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 bg-[#f3f0ff] min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-900 mb-6">
        My Feedback
      </h1>

      {loading ? (
        <div className="flex items-center gap-2 text-indigo-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading feedback...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
          No feedback received yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition"
            >
              {/* Job Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">
                    {fb.job_title || "Job"}
                  </h2>
                  <p className="flex items-center text-sm text-gray-600 gap-1">
                    <Building2 className="h-4 w-4" />
                    {fb.company_name || "Company"}
                  </p>
                </div>
              </div>

              {/* Feedback Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {fb.feedback}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {fb.hr_name || "HR Team"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(fb.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
