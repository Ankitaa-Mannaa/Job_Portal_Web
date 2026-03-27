import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Briefcase,
  Loader2,
  Download,
  PieChart as PieIcon,
  Table as TableIcon,
  ClipboardList,
} from "lucide-react";

/* ---------- Status Colors ---------- */
const STATUS_COLORS = {
  total_jobs: "#4F46E5", // indigo
  active_jobs: "#059669", // emerald
  closed_jobs: "#DC2626", // red
  pending_jobs: "#D97706", // amber
};

/* ---------- Page ---------- */
export default function AdminJobStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user?.token) return;
    let mounted = true;
    setLoading(true);
    setErr("");
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/job-stats`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => mounted && setStats(res.data || {}))
      .catch((e) => setErr(e?.response?.data?.msg || e.message || "Failed"))
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, [user]);

  const chartData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats).map(([k, v]) => ({
      name: formatKey(k),
      value: Number(v) || 0,
      color: STATUS_COLORS[k] || "#9CA3AF",
    }));
  }, [stats]);

  const downloadCsv = () => {
    if (!stats) return;
    const rows = [["Metric", "Value"]];
    Object.entries(stats).forEach(([k, v]) => {
      rows.push([formatKey(k), v]);
    });
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job-stats.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-950">Job Statistics</h2>
          <p className="text-lg italic text-gray-500">
            Overview of job postings on your platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white bg-gray-700 hover:bg-gray-600"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Loading / Error / Empty */}
      {loading && (
        <div className="flex items-center gap-3 rounded-xl border bg-white p-6 shadow">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <span className="text-gray-600">Loading job stats…</span>
        </div>
      )}
      {err && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}
      {!loading && !err && stats && Object.keys(stats).length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-600 shadow">
          No job statistics available
        </div>
      )}

      {/* Content */}
      {!loading && !err && stats && Object.keys(stats).length > 0 && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stats).map(([k, v]) => (
              <StatCard key={k} label={formatKey(k)} value={v} color={STATUS_COLORS[k]} />
            ))}
          </div>

          {/* Chart + Table */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Chart */}
            <div className="rounded-2xl border shadow p-5 bg-white lg:col-span-1">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow">
                  <PieIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Jobs by Status</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border shadow p-5 bg-white lg:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow">
                  <TableIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Breakdown</h3>
              </div>

              <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-full">
                  <thead className="bg-slate-100">
                    <tr className="text-left text-sm text-slate-700">
                      <th className="px-4 py-3">Metric</th>
                      <th className="px-4 py-3">Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {Object.entries(stats).map(([k, v], i) => (
                      <tr
                        key={k}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">{formatKey(k)}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Cards ---------- */
function StatCard({ label, value, color }) {
  return (
    <div
      className="rounded-2xl border shadow p-4 bg-purple-300 text-black hover:scale-[1.02] transition-transform duration-200"
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow"
          style={{ backgroundColor: color }}
        >
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg opacity-80">{label}</div>
          <div className="text-2xl font-extrabold">{value}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */
function formatKey(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
