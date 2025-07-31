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
      <h2>Welcome, {user.name?.toUpperCase() || 'User'}!</h2>
      <p>Your user ID: <strong>{user.id}</strong></p>

      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'company' && <CompanyDashboard />}
      {user.role === 'candidate' && <CandidateDashboard />}

      <button onClick={logout} style={styles.logout}>Logout</button>
      <button onClick={() => navigate('/forgot-password')} style={styles.button}>Forgot Password</button>
      <button onClick={() => navigate('/reset-password')} style={styles.button}>Reset Password</button>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div style={styles.box}>
      <h3>Admin Dashboard</h3>
      <ul>
        <li><a href="/me">View My Profile</a></li>
        <li><a href="/admin/users">View all users</a></li>
        <li><a href="/admin/resume-scores">Resume score analytics</a></li>
        <li><a href="/admin/dropoff-analytics">Drop-off insights</a></li>
        <li><a href="/admin/user-stats">User stats</a></li>
        <li><a href="/admin/job-stats">Job stats</a></li>
        <li><a href="/admin/export-report">Export reports</a></li>
      </ul>
    </div>
  );
}

function CompanyDashboard() {
  return (
    <div style={styles.box}>
      <h3>Company Dashboard</h3>
      <ul style={styles.ul}>
        <li><a href="/me">View My Profile</a></li>
        <li><a href="/company/post-job">Post a Job</a></li>
        <li><a href="/company/applicants">Track Applicants</a></li>
        <li><a href="/company/feedback">Submit Feedback</a></li>
        <li><a href="/company/view-jobs">View Posted Jobs</a></li>
        <li><a href="/company/score-by-user">Get Score Resume by User ID</a></li>
        <li><a href="/company/assign-interview">Assign Interview</a></li>
      </ul>
    </div>
  );
}

function CandidateDashboard() {
  return (
    <div style={styles.box}>
      <h3>Candidate Dashboard</h3>
      <ul style={styles.ul}>
        <li><a href="/me">View My Profile</a></li>
        <li><a href="/candidate/upload-resume">Upload Resume</a></li>
        <li><a href="/candidate/jobs">View All Jobs</a></li>
        <li><a href="/candidate/matched">View Matched Jobs</a></li>
        <li><a href="/candidate/chat">AI Chat about Resume</a></li>
        <li><a href="/candidate/applications">My Applications</a></li>
        <li><a href="/candidate/interview">My Interview Questions</a></li>
        <li><a href="/candidate/feedback">View Feedback from Companies</a></li>
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '50px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    textAlign: 'center',
  },
  box: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    border: '1px solid #bbb',
    borderRadius: 6,
  },
  logout: {
    marginTop: 30,
    padding: '10px 20px',
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '20px',
  },
  button: {
  marginTop: 10,
  padding: '10px 20px',
  backgroundColor: '#0275d8',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  fontWeight: 'bold',
  cursor: 'pointer',
  width: '100%',
 }
};
