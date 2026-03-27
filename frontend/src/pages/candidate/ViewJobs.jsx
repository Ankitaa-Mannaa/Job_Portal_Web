// src/pages/candidate/ViewJobs.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { 
  Briefcase, 
  Loader2, 
  FileText, 
  Clock,  
  Building2, 
  CheckCircle, 
  AlertCircle,
  Search,
  ArrowRight,
  Calendar,
  Sparkles
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ViewJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); // For modal

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);

    axios
      .get(`${API}/api/job/`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setJobs(res.data || []);
        setFilteredJobs(res.data || []);
      })
      .catch(() => setError("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, [user]);

  // Search functionality
  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.company_name && job.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const handleApply = async (jobId) => {
    if (!user?.token) return;
    setApplying(jobId);
    try {
      await axios.post(
        `${API}/api/apply/`,
        { job_id: jobId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      setNotification({
        type: 'success',
        message: 'Application submitted successfully! We\'ll be in touch soon.',
        jobTitle: jobs.find(job => job.id === jobId)?.title
      });
      
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Failed to submit application. Please try again.',
      });
      
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setApplying(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="h-full p-4 pb-12 bg-[#f3f0ff]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Available Opportunities
                </h1>
                <p className="text-gray-600 mt-1">
                  Discover your next career move with {jobs.length} exciting positions
                </p>
              </div>
            </div>
            
            {!loading && jobs.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Sparkles className="h-4 w-4" />
                <span>{jobs.length} jobs available</span>
              </div>
            )}
          </div>

          {/* Search Bar */}
          {!loading && jobs.length > 0 && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              />
              {searchTerm && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification */}
        {notification && (
          <div className={`rounded-2xl p-6 shadow-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-3">
              {notification.type === 'success' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
              <div>
                <p className={`font-semibold ${
                  notification.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {notification.message}
                </p>
                {notification.jobTitle && (
                  <p className="text-green-700 text-sm mt-1">
                    Position: {notification.jobTitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
            <div className="flex items-center justify-center space-x-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">Finding Perfect Jobs</p>
                <p className="text-gray-600">Please wait while we load the latest opportunities...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Unable to Load Jobs</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {job.company_name || job.posted_by || "Company"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {job.description || "Join our dynamic team and make a meaningful impact."}
                  </p>

                  {/* Job Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {formatDate(job.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Full-time</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-600">Actively hiring</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {/* Read More */}
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Read More
                      </button>

                      {/* Apply */}
                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={applying === job.id}
                        className={`group/btn flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                          applying === job.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:scale-105'
                        }`}
                      >
                        {applying === job.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Applying...</span>
                          </>
                        ) : (
                          <>
                            <span>Apply Now</span>
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
              {/* Close button */}
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-sm text-gray-600">{selectedJob.company_name || "Company"}</p>
                </div>
              </div>

              {/* Full Description */}
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedJob.description}
              </p>

              {/* Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
