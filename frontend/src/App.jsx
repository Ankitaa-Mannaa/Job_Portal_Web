import React from "react";
import { AnimatePresence } from "framer-motion";

import { Routes, Route, Navigate } from "react-router-dom";
import RoleBasedRoute from "./routes/RoleBasedRoute";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import CandidateLayout from "./layouts/CandidateLayout";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";

// Shared
import Profile from "./pages/shared/Profile";
import { useAuth } from "./context/AuthContext";

// admin pages
import AdminUserStats from "./pages/admin/AdminUserStats";
import AdminManageUsers from "./pages/admin/AdminManageUsers";
import AdminJobStats from "./pages/admin/AdminJobStats";
import AdminExportReports from "./pages/admin/AdminExportReports";
import AdminResumeScores from "./pages/admin/AdminResumeScores";
import AdminDropoffAnalytics from "./pages/admin/AdminDropoffAnalytics";

// candidate pages
import MyApplications from "./pages/candidate/MyApplications";
import ViewJobs from "./pages/candidate/ViewJobs";
import Feedback from "./pages/candidate/Feedback";
import UploadResume from "./pages/candidate/UploadResume";
import AIChat from "./pages/candidate/AIChat";
import MatchedJobs from "./pages/candidate/MatchedJobs";
import AssignedQuestions from "./pages/candidate/AssignedQuestions";

// company pages
import PostJob from "./pages/company/PostJob";
import CompanyViewJobs from "./pages/company/CompanyJobs";
import TrackApplicants from "./pages/company/TrackApplicants";
import SubmitFeedback from "./pages/company/SubmitFeedback";
import AssignInterview from "./pages/company/AssignInterview";
import ScoreResume from "./pages/company/ScoreResume";


function App() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Root redirect */}
      <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : user.role === "company" ? (
                <Navigate to="/company" replace />
              ) : (
                <Navigate to="/candidate" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </RoleBasedRoute>
        }
      > 
        <Route index element={<AdminDashboard />} />
        <Route path="me" element={<Profile />} />
        <Route path="user-stats" element={<AdminUserStats />} />
        <Route path="users" element={<AdminManageUsers />} />
        <Route path="job-stats" element={<AdminJobStats/>}/>
        <Route path="export-reports" element={<AdminExportReports />} />
        <Route path="resume-scores" element={<AdminResumeScores />} />
        <Route path="dropoff-analytics" element={<AdminDropoffAnalytics />} />
      </Route>

      {/* Company routes */}
      <Route
        path="/company/*"
        element={
          <RoleBasedRoute allowedRoles={["company"]}>
            <CompanyLayout />
          </RoleBasedRoute>
        }
      >
        <Route index element={<CompanyDashboard />} />
        <Route path="me" element={<Profile />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="view-jobs" element={<CompanyViewJobs />} />
        <Route path="applicants" element={<TrackApplicants/>} />
        <Route path="feedback" element={<SubmitFeedback/>} />
        <Route path="assign-interview" element={<AssignInterview/>} />
        <Route path="score-resume" element={<ScoreResume />} />
      </Route>

      {/* Candidate routes */}
      <Route
        path="/candidate/*"
        element={
          <RoleBasedRoute allowedRoles={["candidate"]}>
            <CandidateLayout />
          </RoleBasedRoute>
        }
      >
        <Route index element={<CandidateDashboard />} />
        <Route path="me" element={<Profile />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="jobs" element={<ViewJobs />} />
        <Route path="feedback" element={<Feedback/>} />
        <Route path="upload-resume" element={<UploadResume/>} />
        <Route path="ai-chat" element={<AIChat />} />
        <Route path="matched-jobs" element={<MatchedJobs />} />
        <Route path="assigned-questions" element={<AssignedQuestions />} />
      </Route>

      {/* Catch-all */}
      <Route
        path="*"
        element={<div className="p-6 text-center">404 - Page Not Found</div>}
      />
    </Routes>
    </AnimatePresence>
  );
}

export default App;
