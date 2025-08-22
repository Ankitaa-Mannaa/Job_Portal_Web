import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Search,
  Filter,
  Shield,
  Building2,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Download,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";

const ROLE_BADGE = {
  admin: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  company: "bg-amber-100 text-amber-700 border border-amber-200",
  candidate: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};
const ROLE_ICON = {
  admin: Shield,
  company: Building2,
  candidate: UserIcon,
};

export default function AdminManageUsers() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // UI state
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const total = useMemo(() => rows.length, [rows]);

  // Debounced search
  const qRef = useRef(query);
  useEffect(() => {
    const id = setTimeout(() => (qRef.current = query), 300);
    return () => clearTimeout(id);
  }, [query]);

  // Fetch users
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");

    const base = import.meta.env.VITE_API_BASE_URL;
    const urlTryPaged = `${base}/api/admin/users?query=${encodeURIComponent(
      qRef.current
    )}&role=${role === "all" ? "" : role}&page=${page}&page_size=${pageSize}`;

    const headers = { Authorization: `Bearer ${user?.token}` };

    (async () => {
      try {
        const r1 = await axios.get(urlTryPaged, { headers });
        if (!mounted) return;
        if (Array.isArray(r1.data?.items)) {
          setRows(r1.data.items);
        } else if (Array.isArray(r1.data)) {
          setRows(r1.data);
        } else {
          const r2 = await axios.get(`${base}/api/admin/users`, { headers });
          if (!mounted) return;
          setRows(Array.isArray(r2.data) ? r2.data : []);
        }
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.msg || e.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [user, role, page, pageSize]);

  // Client-side filter + sort
  const filteredSorted = useMemo(() => {
    const q = qRef.current?.toLowerCase?.() || "";
    let data = rows.filter((r) => {
      const matchesQ =
        !q ||
        [r.username, r.email, r.id?.toString?.()]
          .filter(Boolean)
          .some((x) => x.toLowerCase().includes(q));
      const matchesRole = role === "all" || r.role?.toLowerCase() === role;
      return matchesQ && matchesRole;
    });

    data.sort((a, b) => {
      const A = (a?.[sortKey] ?? "").toString().toLowerCase();
      const B = (b?.[sortKey] ?? "").toString().toLowerCase();
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [rows, role, sortKey, sortDir]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  const pages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const exportCsv = () => {
    const rowsForCsv = [["ID", "Username", "Email", "Role", "Created"]];
    filteredSorted.forEach((r) =>
      rowsForCsv.push([
        r.id,
        safe(r.username),
        safe(r.email),
        r.role,
        r.created_at || "",
      ])
    );
    const blob = new Blob([rowsForCsv.map((r) => r.join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmDelete = async (id) => {
    if (!window.confirm(`Delete user ${id}?`)) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert(e?.response?.data?.msg || e.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8 mt-3 pb-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-purple-950">Manage Users</h2>
            <p className="text-lg font-bold italic text-gray-500">
              Search, filter, and manage platform users
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
    onClick={exportCsv}
    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition"
  >
    <Download className="h-5 w-5" />
    Export CSV
  </button>
          <Link
    to="/admin/user-stats"
    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-700 transition"
  >
    <Users className="h-5 w-5" />
    User stats
  </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
         <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-500" />
          <input
            type="text"
            className="w-auto appearance-none rounded-full border border-indigo-300 bg-white pl-10 pr-8 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
          <div className="relative">
  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />
  <select
    className="w-auto appearance-none rounded-full border border-indigo-300 bg-white pl-10 pr-8 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition"
    value={role}
    onChange={(e) => {
      setPage(1);
      setRole(e.target.value);
    }}
  >
    <option value="all">All Roles</option>
    <option value="admin">Admin</option>
    <option value="company">Company</option>
    <option value="candidate">Candidate</option>
  </select>
  <ChevronRight className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500 rotate-90 pointer-events-none" />
</div>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2 text-sm">
          <button
            className="rounded-md border p-1.5 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-gray-600">
            Page <b>{page}</b> of <b>{pages}</b>
          </span>
          <button
            className="rounded-md border p-1.5 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 text-left text-gray-600 text-lg uppercase tracking-wider">
            <tr>
              <Th onClick={() => toggleSort("username")} active={sortKey === "username"} dir={sortDir}>
                User
              </Th>
              <Th onClick={() => toggleSort("email")} active={sortKey === "email"} dir={sortDir}>
                Email
              </Th>
              <Th onClick={() => toggleSort("role")} active={sortKey === "role"} dir={sortDir}>
                Role
              </Th>
              <Th onClick={() => toggleSort("created_at")} active={sortKey === "created_at"} dir={sortDir}>
                Joined
              </Th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {err && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-red-600">
                  {err}
                </td>
              </tr>
            )}
            {!loading && !err && paged.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
            {paged.map((r) => (
              <tr key={r.id} className="hover:bg-gray-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.username} />
                    <div>
                      <div className="font-bold text-gray-800">{r.username}</div>
                      <div className="text-xs text-gray-700">ID: {r.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700 font-bold italic">{r.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold ${ROLE_BADGE[r.role] || "bg-slate-100 text-slate-700"}`}
                  >
                    {RoleIcon(r.role)}
                    {capitalize(r.role)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {formatDate(r.created_at)}
                </td>
                <td className="px-4 py-3">
  <div className="flex items-center gap-2">
    <button
      onClick={() => confirmDelete(r.id)}
      className="flex items-center gap-2 rounded-full border px-3 py-1.5 bg-red-600 text-white hover:bg-red-400"
      title="Delete"
    >
      <Trash2 className="h-4 w-4" />
      <span className="font-bold">Delete</span>
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Small UI pieces ---------- */
function Th({ children, onClick, active, dir }) {
  return (
    <th
      className="px-4 py-3 select-none cursor-pointer"
      onClick={onClick}
      title="Sort"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown
          className={`h-3.5 w-3.5 ${active ? "text-black" : "text-black"}`}
          style={{ transform: active && dir === "desc" ? "rotate(180deg)" : "none" }}
        />
      </span>
    </th>
  );
}

function Avatar({ name = "" }) {
  const initials = name
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white flex items-center justify-center text-xs font-bold shadow">
      {initials || "U"}
    </div>
  );
}

function RoleIcon(role) {
  const Icon = ROLE_ICON[role] || UserIcon;
  return <Icon className="h-3.5 w-3.5" />;
}

/* ---------- Helpers ---------- */
function safe(s) {
  return (s || "").toString().replaceAll(",", " ");
}
function capitalize(s = "") {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function formatDate(d) {
  if (!d) return "-";
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString();
}
