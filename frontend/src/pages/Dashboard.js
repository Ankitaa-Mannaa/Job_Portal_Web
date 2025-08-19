import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <h2 style={styles.loading}>Loading...</h2>;
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome, {user.name?.toUpperCase() || 'User'}!</h1>
      <p style={styles.userId}>Your user ID: <strong>{user.id}</strong></p>

      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'company' && <CompanyDashboard />}
      {user.role === 'candidate' && <CandidateDashboard />}

      <div style={styles.buttonGroup}>
        <button onClick={logout} style={styles.logout}>Logout</button>
        <button onClick={() => navigate('/forgot-password')} style={styles.secondary}>Forgot Password</button>
        <button onClick={() => navigate('/reset-password')} style={styles.secondary}>Reset Password</button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return renderDashboard("Admin", [
    { label: "View My Profile", path: "/me" },
    { label: "View All Users", path: "/admin/users" },
    { label: "Resume Score Analytics", path: "/admin/resume-scores" },
    { label: "Drop-off Insights", path: "/admin/dropoff-analytics" },
    { label: "User Stats", path: "/admin/user-stats" },
    { label: "Job Stats", path: "/admin/job-stats" },
    { label: "Export Reports", path: "/admin/export-report" },
  ]);
}

function CompanyDashboard() {
  return renderDashboard("Company", [
    { label: "View My Profile", path: "/me" },
    { label: "Post a Job", path: "/company/post-job" },
    { label: "Track Applicants", path: "/company/applicants" },
    { label: "Submit Feedback", path: "/company/feedback" },
    { label: "View Posted Jobs", path: "/company/view-jobs" },
    { label: "Score Resume by User ID", path: "/company/score-by-user" },
    { label: "Assign Interview", path: "/company/assign-interview" },
  ]);
}

function CandidateDashboard() {
  return renderDashboard("Candidate", [
    { label: "View My Profile", path: "/me" },
    { label: "Upload Resume", path: "/candidate/upload-resume" },
    { label: "View All Jobs", path: "/candidate/jobs" },
    { label: "View Matched Jobs", path: "/candidate/matched" },
    { label: "AI Chat About Resume", path: "/candidate/chat" },
    { label: "My Applications", path: "/candidate/applications" },
    { label: "My Interview Questions", path: "/candidate/interview" },
    { label: "View Feedback from Companies", path: "/candidate/feedback" },
  ]);
}

function renderDashboard(title, links) {
  return (
    <div style={styles.card}>
      <h2 style={styles.subheading}>{title} Dashboard</h2>
      <ul style={styles.linkList}>
        {links.map(({ label, path }) => (
          <li key={path}>
            <a href={path} style={styles.link}>{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '60px auto',
    padding: '30px 40px',
    border: '1px solid #ccc',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '26px',
    marginBottom: '10px',
    color: '#333',
  },
  userId: {
    marginBottom: '30px',
    fontSize: '16px',
    color: '#555',
  },
  subheading: {
    fontSize: '20px',
    marginBottom: 20,
    color: '#444',
  },
  card: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    border: '1px solid #ddd',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    display: 'block',
    padding: '8px 0',
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
    transition: 'color 0.2s',
  },
  logout: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 6,
    marginBottom: 10,
    cursor: 'pointer',
    width: '100%',
  },
  secondary: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 6,
    marginBottom: 10,
    cursor: 'pointer',
    width: '100%',
  },
  buttonGroup: {
    marginTop: 20,
  },
  loading: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 20,
  },
};
