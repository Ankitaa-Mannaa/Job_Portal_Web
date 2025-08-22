import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Upload,
  FileText,
  Trash2,
  RefreshCw,
  Loader2,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  X,
  File,
  Plus,
  ExternalLink,
  CloudUpload,
  Shield
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function UploadResume() {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingResume, setFetchingResume] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

useEffect(() => {
  if (!user?.token) return;
  setFetchingResume(true);
  axios
    .get(`${API}/api/resume/my`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    .then((res) => {
      // Backend might return { filename, file_url } or wrapped in { result }
      const data = res.data.result || res.data;
      if (data && data.filename) {
        setResume(data);
      } else {
        setResume(null);
      }
    })
    .catch(() => setResume(null))
    .finally(() => setFetchingResume(false));
}, [user]);

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
    } else {
      showMessage("Please upload a valid resume file (PDF, DOC, DOCX, or TXT)", "error");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      showMessage("Please upload a valid resume file (PDF, DOC, DOCX, or TXT)", "error");
    }
  };

  const isValidFile = (file) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) return false;
    if (file.size > maxSize) {
      showMessage("File size must be less than 10MB", "error");
      return false;
    }
    return true;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
  if (!file) return;
  setLoading(true);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(`${API}/api/resume/upload`, formData, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Normalize backend response
    const data = res.data.result || res.data;
    if (data && data.filename) {
      setResume(data);
      showMessage("Resume uploaded successfully! Your profile has been updated.", "success");
    } else {
      showMessage("Upload succeeded but response missing resume data.", "error");
    }

    setFile(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  } catch (err) {
    showMessage("Failed to upload resume. Please try again.", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Resume Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Upload, preview, and manage your professional resume
                </p>
              </div>
            </div>
            
            {resume && (
              <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span>Resume Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {fetchingResume && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-center space-x-4">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="text-gray-600">Loading your resume...</span>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {!fetchingResume && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CloudUpload className="h-5 w-5 mr-2 text-indigo-600" />
                {resume ? 'Update Resume' : 'Upload Resume'}
              </h2>
              <p className="text-gray-600 mt-1">
                {resume ? 'Replace your current resume with a new version' : 'Upload your resume to get started'}
              </p>
            </div>

            <div className="p-6">
              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-indigo-400 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading}
                />
                
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-indigo-600" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {dragActive ? 'Drop your resume here' : 'Choose a file or drag it here'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Supports PDF, DOC, DOCX, TXT up to 10MB
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Browse Files
                  </button>
                </div>
              </div>

              {/* Selected File Preview */}
              {file && (
                <div className="mt-2 bg-gray-50 rounded-xl p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <File className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setFile(null)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            <span>Upload Resume</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Resume Section */}
        {!fetchingResume && resume && (
          <div className="bg-white w-full h-full rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Current Resume
                  </h2>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">{resume.filename}</span>
                  </p>
                </div>                
              </div>
            </div>

            {/* Resume Info */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">File Name</p>
                    <p className="font-medium text-gray-900">{resume.filename}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available for</p>
                    <p className="font-medium text-purple-600">Job Applications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Resume State */}
        {!fetchingResume && !resume && (
          <div className="bg-white w-fulll h-full rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resume Uploaded</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Upload your resume to start applying for jobs and showcase your professional experience.
            </p>
          </div>
        )}

        {/* Status Messages */}
        {message && (
          <div className={`rounded-2xl p-4 shadow-lg border ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200' 
              : messageType === 'error'
              ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center space-x-3">
              {messageType === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : messageType === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-blue-600" />
              )}
              <p className={`font-medium ${
                messageType === 'success' 
                  ? 'text-green-900' 
                  : messageType === 'error'
                  ? 'text-red-900'
                  : 'text-blue-900'
              }`}>
                {message}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && resume?.file_url && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={resume.file_url}
                title="Resume Preview"
                className="w-full h-full border border-gray-200 rounded-lg"
                onError={() => {
                  showMessage("Unable to preview this file. Try downloading it instead.", "error");
                  setShowPreview(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}