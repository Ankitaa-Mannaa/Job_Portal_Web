import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { 
  Loader2, 
  FileText, 
  TrendingUp, 
  Users, 
  Award,
  BarChart3,
  Star,
  Target,
  AlertCircle
} from "lucide-react";

export default function AdminResumeScores() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/resume-scores`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setScores(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // Calculate summary statistics
  const totalCandidates = scores.reduce((sum, row) => sum + parseInt(row.num_candidates || 0), 0);
  const avgOverallScore = scores.length > 0 
    ? (scores.reduce((sum, row) => sum + parseFloat(row.avg_score || 0), 0) / scores.length).toFixed(1)
    : 0;
  const highestScore = Math.max(...scores.map(row => parseFloat(row.avg_score || 0)));
  const lowestScore = Math.min(...scores.map(row => parseFloat(row.avg_score || 0)));

  const getScoreColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 8) return "text-green-600 bg-green-50";
    if (numScore >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreBadge = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 8) return { icon: Award, color: "text-green-600", bg: "bg-green-100" };
    if (numScore >= 6) return { icon: Target, color: "text-yellow-600", bg: "bg-yellow-100" };
    return { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" };
  };

  return (
    <div className="min-h-screen p-3">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="p-2">
          <div className="flex items-center mb-2">
            <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Resume Score Analysis
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive analysis of candidate resume scores across all job postings
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-center space-x-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">Analyzing Resume Scores</p>
                <p className="text-gray-600">Please wait while we gather the data...</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {!loading && scores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{scores.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCandidates.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{avgOverallScore}/10</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Score Range</p>
                  <p className="text-2xl font-bold text-gray-900">{lowestScore.toFixed(1)} - {highestScore.toFixed(1)}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && scores.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Detailed Score Breakdown</h2>
              <p className="text-gray-600 mt-1">Resume performance metrics by job posting</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scores.map((row, i) => {
                    const badge = getScoreBadge(row.avg_score);
                    const IconComponent = badge.icon;
                    
                    return (
                      <tr key={row.job_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                              <FileText className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{row.job_title}</p>
                              <p className="text-xs text-gray-500">Job ID: {row.job_id}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(row.avg_score)}`}>
                              {row.avg_score}/10
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{row.num_candidates}</span>
                            <span className="text-xs text-gray-500">applicants</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className={`h-8 w-8 ${badge.bg} rounded-lg flex items-center justify-center`}>
                              <IconComponent className={`h-4 w-4 ${badge.color}`} />
                            </div>
                            <span className={`text-sm font-medium ${badge.color}`}>
                              {parseFloat(row.avg_score) >= 8 ? 'Excellent' : 
                               parseFloat(row.avg_score) >= 6 ? 'Good' : 'Needs Improvement'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && scores.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resume Scores Available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are currently no resume scores to display. Once candidates start applying and their resumes are analyzed, the data will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}