import { useState } from "react";
import { Download, FileText, Users, Briefcase, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminExportReports() {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const exportData = async () => {
    const token = user?.token;
    if (!token) {
      setError("Authentication token not available");
      return;
    }

    setDownloading(true);
    setError(null);
    setDownloadComplete(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/export-report`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "text/csv",
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `platform-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 3000);
    } catch (err) {
      setError(err.message || "Export failed. Please try again.");
      console.error("❌ Export failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const reportTypes = [
    {
      id: 'users',
      title: 'User Analytics',
      description: 'Complete user data including registrations, activity, and demographics',
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'jobs',
      title: 'Job Statistics',
      description: 'Job postings, applications, hiring rates, and company metrics',
      icon: Briefcase,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'activity',
      title: 'Platform Activity',
      description: 'User engagement, session data, and platform usage analytics',
      icon: Activity,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Export Reports
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download comprehensive platform analytics and reports in CSV format for analysis and record-keeping
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {downloadComplete && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700">Report downloaded successfully!</p>
            </div>
          </div>
        )}

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reportTypes.map((report) => (
            <div key={report.id} className={`${report.bgColor} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`w-12 h-12 ${report.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <report.icon className={`w-6 h-6 ${report.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
            </div>
          ))}
        </div>

        {/* Export Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Download className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Platform Report</h2>
                <p className="text-gray-600">
                  Export all platform data including users, jobs, applications, and analytics in one comprehensive CSV file
                </p>
              </div>

              <button
                onClick={exportData}
                disabled={downloading}
                className={`w-full py-4 px-8 rounded-2xl font-semibold text-white shadow-lg transition-all transform ${
                  downloading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : downloadComplete
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {downloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Preparing Export...</span>
                    </>
                  ) : downloadComplete ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Export Complete</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Export Full Report</span>
                    </>
                  )}
                </div>
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
                <span>• CSV Format</span>
                <span>• Secure Download</span>
                <span>• Complete Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-2">Export Details</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• User registration and profile data</li>
              <li>• Job postings and application metrics</li>
              <li>• Platform activity and engagement stats</li>
              <li>• Resume scores and analytics</li>
            </ul>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-2">File Information</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Format: Comma-separated values (CSV)</li>
              <li>• Encoding: UTF-8</li>
              <li>• Date: {new Date().toLocaleDateString()}</li>
              <li>• Automated filename with timestamp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}