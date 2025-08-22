// src/pages/admin/AdminDropoffAnalytics.jsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Loader2, Activity } from "lucide-react";

export default function AdminDropoffAnalytics() {
  const { user } = useAuth();
  const [dropoffSummary, setDropoffSummary] = useState([]);
  const [noFeedbackList, setNoFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/dropoff-analytics`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setDropoffSummary(res.data.summary || []);
        setNoFeedbackList(res.data.no_feedback || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // Map backend data into chart-friendly format
  const statusLabels = {
    applied: "Application Submitted",
    shortlisted: "Shortlisted",
    interview: "Interview Stage",
    hired: "Hired",
    rejected: "Rejected",
  };

  const chartData = useMemo(() => {
    return dropoffSummary.map((item) => ({
      stage: statusLabels[item.status?.toLowerCase()] || item.status,
      dropoffs: item.count,
    }));
  }, [dropoffSummary]);

  // No feedback chart data
  const noFeedbackData = useMemo(() => {
    const grouped = {};
    noFeedbackList.forEach((row) => {
      const key = row.status?.toLowerCase() || "Unknown";
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped).map(([status, count]) => ({
      stage: statusLabels[status] || status,
      count,
    }));
  }, [noFeedbackList]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-purple-500 border-2 border-black text-white font-bold flex items-center justify-center shadow">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-indigo-800">
            Drop-off Analytics
          </h2>
          <p className="text-gray-500 italic font-semibold">
            Track where candidates drop off in the hiring process & monitor feedback gaps
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-md border bg-white px-4 py-3 shadow">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <span>Loading drop-off data…</span>
        </div>
      )}

      {/* Charts in two columns */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left → Drop-off Line Chart */}
          <div className="h-80 border rounded-md overflow-hidden shadow bg-gradient-to-t from-green-300 to-red-300 p-2">
            <h3 className="text-center text-lg font-bold text-indigo-900 mb-2">
              Candidate Drop-offs by Stage
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid
                  stroke="#374151"
                  strokeOpacity={0.3}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="stage"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={{
                    fill: "#111827",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#111827",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="dropoffs"
                  stroke="#DC2626"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: "#DC2626",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Right → No Feedback Bar Chart */}
          <div className="h-80 border rounded-md overflow-hidden shadow bg-gradient-to-t from-green-300 to-red-300 p-2">
            <h3 className="text-center text-lg font-bold text-indigo-900 mb-2">
              Applications Without Feedback
            </h3>
            {noFeedbackData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={noFeedbackData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="stage"
                    interval={0}
                    tick={{ fill: "#111827", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#111827", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#F59E0B"
                    name="No Feedback Count"
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600">
                All applications have feedback 🎉
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
