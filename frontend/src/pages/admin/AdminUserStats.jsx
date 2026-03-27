// src/pages/admin/AdminUserStats.jsx
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { 
  Users, 
  Shield, 
  Building2, 
  Loader2, 
  Download, 
  PieChart as PieIcon, 
  Table as TableIcon,
  TrendingUp,
  Activity,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

/* ---------- Colors / Icons ---------- */
const ROLE_COLORS = {
  admin: "#8B5CF6",     // Purple
  candidate: "#10B981", // Green
  company: "#F59E0B",   // Orange
};

const ROLE_GRADIENTS = {
  admin: "from-purple-500 to-violet-600",
  candidate: "from-emerald-500 to-green-600", 
  company: "from-amber-500 to-orange-600",
};

const ROLE_ICONS = { 
  admin: Shield, 
  candidate: Users, 
  company: Building2 
};

/* ---------- Page ---------- */
export default function AdminUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/user-stats`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      .then((res) => mounted && setStats(Array.isArray(res.data) ? res.data : []))
      .catch((e) => setErr(e?.response?.data?.msg || e.message || "Failed"))
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, [user]);

  const total = useMemo(
    () => stats.reduce((s, r) => s + (Number(r.count) || 0), 0),
    [stats]
  );

  const chartData = useMemo(
    () =>
      stats.map((r) => ({
        name: capitalize(r.name),
        value: Number(r.count) || 0,
        color: ROLE_COLORS[r.name] || "#94A3B8",
      })),
    [stats]
  );

  const downloadCsv = () => {
    const rows = [["Role", "Count", "Percent"]];
    stats.forEach((r) => {
      const pct = total ? ((Number(r.count) || 0) / total) * 100 : 0;
      rows.push([r.name, String(r.count), pct.toFixed(1) + "%"]);
    });
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-stats-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className= "p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  User Analytics
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Platform user distribution and insights
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'overview' ? 'detailed' : 'overview')}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Activity className="h-4 w-4" />
                {viewMode === 'overview' ? 'Detailed View' : 'Overview'}
              </button>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg transition-all"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-medium text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg transition-all"
              >
                <Users className="h-4 w-4" />
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="text-gray-600 text-lg">Loading user analytics…</span>
            </div>
          </div>
        )}

        {err && !loading && (
          <div className="bg-red-50/70 backdrop-blur-sm border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <p className="text-red-700 font-medium">{err}</p>
            </div>
          </div>
        )}

        {!loading && !err && stats.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-12 text-center shadow-lg">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600">User statistics will appear here once data is available.</p>
          </div>
        )}

        {/* Content */}
        {!loading && !err && stats.length > 0 && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TotalCard total={total} />
              {stats.map((r) => (
                <RoleCard key={r.name} role={r.name} count={r.count} total={total} />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <PieIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Distribution</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        animationDuration={800}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name, p) => [
                          `${val} users (${percent(p.payload.value, total)})`,
                          name,
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Comparison</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <Tooltip
                        formatter={(val, name) => [`${val} users`, 'Count']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[8, 8, 0, 0]}
                        animationDuration={800}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <TableIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Breakdown</h3>
                </div>

                <div className="space-y-4">
                  {stats.map((r, i) => {
                    const val = Number(r.count) || 0;
                    const pctNum = total ? (val / total) * 100 : 0;
                    const color = ROLE_COLORS[r.name] || "#94A3B8";
                    const Icon = ROLE_ICONS[r.name] || Users;

                    return (
                      <div key={r.name} className="bg-gray-50/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: color + '20' }}
                            >
                              <Icon className="w-4 h-4" style={{ color }} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{capitalize(r.name)}</p>
                              <p className="text-sm text-gray-500">{pctNum.toFixed(1)}% of total</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">{val}</p>
                            <p className="text-xs text-gray-500">users</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-800"
                            style={{
                              width: `${pctNum}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Most Common Role</p>
                    <p className="text-2xl font-bold">
                      {stats.length > 0 ? capitalize(stats.reduce((max, r) => 
                        Number(r.count) > Number(max.count) ? r : max
                      ).name) : 'N/A'}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Average per Role</p>
                    <p className="text-2xl font-bold">
                      {stats.length > 0 ? Math.round(total / stats.length) : 0}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-emerald-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Role Diversity</p>
                    <p className="text-2xl font-bold">{stats.length} Types</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Cards ---------- */

function RoleCard({ role, count, total }) {
  const Icon = ROLE_ICONS[role] || Users;
  const color = ROLE_COLORS[role] || "#94A3B8";
  const gradient = ROLE_GRADIENTS[role] || "from-gray-400 to-gray-500";
  const pct = total ? ((Number(count) || 0) / total) * 100 : 0;

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-md`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {capitalize(role)}
          </p>
          <p className="text-2xl font-bold text-gray-800">{Number(count) || 0}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{pct.toFixed(1)}% of total</span>
          <span className="font-medium text-gray-800">{total} total</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function TotalCard({ total }) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-indigo-100 text-sm font-medium uppercase tracking-wide">
            Total Users
          </p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
      </div>
      <p className="text-indigo-100 text-sm">Across all roles in the platform</p>
    </div>
  );
}

/* ---------- Helpers ---------- */
function capitalize(s = "") {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function percent(val, total) {
  if (!total) return "0%";
  return ((val / total) * 100).toFixed(1) + "%";
}