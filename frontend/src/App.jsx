import { Routes, Route ,useLocation} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Applicants from "./pages/Applicants";
import MyJobs from "./pages/MyJobs";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Landing from "./pages/Landing";
import RecruiterApplicants from "./pages/RecruiterApplicants";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCandidates from "./pages/AdminCandidates";
import AdminRecruiters from "./pages/AdminRecruiters";
import AdminJobs from "./pages/AdminJobs";

function App() {
  
  const location=useLocation();
  return (
  
    <>

    { location.pathname !== "/" && location.pathname!=="/login" && 
      location.pathname!=="/signup"&&(
      <Navbar/>
    )}

      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applicants/:id"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute>
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-job/:id"
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter-applicants"
          element={
            <ProtectedRoute>
              <RecruiterApplicants />
            </ProtectedRoute>}
        />

        <Route
         path="/notifications"
         element={<Notifications />}
        />

        <Route
          path="/admin/dashboard"
          element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
          }
        />
        <Route
          path="/admin/candidates"
          element={
          <ProtectedRoute>
          <AdminCandidates/>
          </ProtectedRoute>
          }
        />
          
        <Route
          path="/admin/recruiters"
          element={
          <ProtectedRoute>
          <AdminRecruiters/>
          </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
          <ProtectedRoute>
            <AdminJobs />
          </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;