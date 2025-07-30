import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminUserStats from './pages/Admin/AdminUserStats';
import AdminJobStats from './pages/Admin/AdminJobStats';
import AdminExportReport from './pages/Admin/AdminExportReport';
import AdminResumeScores from './pages/Admin/AdminResumeScores';
import AdminDropoffAnalytics from './pages/Admin/AdminDropoffAnalytics';
import PostJob from './pages/company/JobPost';
import TrackApplicants from './pages/company/TrackApplicants';
import SubmitFeedback from './pages/company/SubmitFeedback';
import ViewJobs from './pages/company/ViewJobs';
import UploadResume from './pages/candidate/UploadResume';
import AllJobs from './pages/candidate/AllJobs';
import MatchedJobs from './pages/candidate/MatchedJobs';
import ResumeChat from './pages/candidate/ResumeChat';
import MyApplications from './pages/candidate/MyApplications';
import Profile from './pages/shared/Profile';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute role="admin"><Dashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminUsers /></PrivateRoute>} />
      <Route path="/admin/user-stats" element={<PrivateRoute role="admin"><AdminUserStats /></PrivateRoute>} />
      <Route path="/admin/job-stats" element={<PrivateRoute role="admin"><AdminJobStats /></PrivateRoute>} />
      <Route path="/admin/export-report" element={<PrivateRoute role="admin"><AdminExportReport /></PrivateRoute>} />
      <Route path="/admin/resume-scores" element={<PrivateRoute role="admin"><AdminResumeScores /></PrivateRoute>} />
      <Route path="/admin/dropoff-analytics" element={<PrivateRoute role="admin"><AdminDropoffAnalytics /></PrivateRoute>} />
      <Route path="/company/post-job" element={<PrivateRoute role="company"><PostJob /></PrivateRoute>} />
      <Route path="/company/applicants" element={<PrivateRoute role="company"><TrackApplicants /></PrivateRoute>} />
      <Route path="/company/feedback" element={<PrivateRoute role="company"><SubmitFeedback /></PrivateRoute>} />
      <Route path="/company/view-jobs" element={<PrivateRoute role="company"><ViewJobs /></PrivateRoute>} />
      <Route path="/candidate/upload-resume" element={<PrivateRoute role="candidate"><UploadResume /></PrivateRoute>} />
      <Route path="/candidate/jobs" element={<PrivateRoute role="candidate"><AllJobs /></PrivateRoute>} />
      <Route path="/candidate/matched" element={<PrivateRoute role="candidate"><MatchedJobs /></PrivateRoute>} />
      <Route path="/candidate/chat" element={<PrivateRoute role="candidate"><ResumeChat /></PrivateRoute>} />
      <Route path="/candidate/applications" element={<PrivateRoute role="candidate"><MyApplications /></PrivateRoute>} />
      <Route path="/me" element={<PrivateRoute><Profile /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
