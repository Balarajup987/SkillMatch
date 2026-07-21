import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(res.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <h1 className="text-3xl p-10">Loading...</h1>;
  }

  if (!stats) {
    return (
      <h1 className="text-3xl p-10 text-red-500">
        Failed to load dashboard
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-10 shadow-xl mb-10">
        <h1 className="text-5xl font-bold mb-4">
          Welcome back, {user?.name}
        </h1>
        <p className="text-xl">AI Powered Job Portal Dashboard</p>
        <p className="mt-3 text-lg capitalize">Role: {user?.role}</p>
      </div>

      {/* Candidate */}
      {user?.role === "candidate" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Candidate Dashboard</h2>

            <Link
              to="/jobs"
              className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500"
            >
              Browse Jobs
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Link to="/my-applications">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl">
                <h3>Applied Jobs</h3>
                <p className="text-4xl font-bold mt-2">
                  {stats.appliedJobs}
                </p>
              </div>
            </Link>

            <Link to="/my-applications?status=shortlisted">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl">
                <h3>Shortlisted</h3>
                <p className="text-4xl font-bold mt-2 text-green-600">
                  {stats.shortlisted}
                </p>
              </div>
            </Link>

            <Link to="/my-applications?status=rejected">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500 hover:shadow-xl">
                <h3>Rejected</h3>
                <p className="text-4xl font-bold mt-2 text-red-600">
                  {stats.rejected}
                </p>
              </div>
            </Link>

            <Link to="/my-applications?status=pending">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl">
                <h3>Pending</h3>
                <p className="text-4xl font-bold mt-2 text-yellow-500">
                  {stats.pending}
                </p>
              </div>
            </Link>
          </div>

          {/* Recent + Recommended */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4">
                Recent Applications
              </h3>

              <div className="space-y-4">
                {stats.recentApplications?.map((app) => (
                  <Link
                    key={app._id}
                    to={`/jobs/${app.job?._id}`}
                    className="block"
                  >
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-xl hover:scale-[1.02] transition">
                      <h4 className="font-bold text-lg">
                        {app.job?.title}
                      </h4>

                      <p className="text-gray-500">
                        {app.job?.company}
                      </p>

                      <div className="mt-3 flex justify-between">
                        <span>{app.job?.location}</span>
                        <span>{app.status}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4">
                Recommended Jobs
              </h3>

              <div className="space-y-4">
                {stats.recommendedJobs?.map((job) => (
                  <Link
                    key={job._id}
                    to={`/jobs/${job._id}`}
                    className="block"
                  >
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-xl hover:scale-[1.02] transition">
                      <h4 className="font-bold text-lg">{job.title}</h4>
                      <p className="text-gray-500">{job.company}</p>
                      <p className="mt-2 text-sm">{job.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recruiter */}
{user?.role === "recruiter" && (
  <>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold">
        Recruiter Dashboard
      </h2>

      <Link
        to="/create-job"
        className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500"
      >
        + Create Job
      </Link>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
      <Link to="/my-jobs">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
          <h3>Jobs Posted</h3>
          <p className="text-4xl font-bold mt-2">
            {stats.jobsPosted}
          </p>
        </div>
      </Link>

      <Link to="/recruiter-applicants">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
          <h3>Total Applicants</h3>
          <p className="text-4xl font-bold mt-2">
            {stats.totalApplicants}
          </p>
        </div>
      </Link>

      <Link to="/recruiter-applicants?status=pending">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
          <h3>Pending</h3>
          <p className="text-4xl font-bold mt-2 text-yellow-500">
            {stats.pending}
          </p>
        </div>
      </Link>

      <Link to="/recruiter-applicants?status=shortlisted">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
          <h3>Shortlisted</h3>
          <p className="text-4xl font-bold mt-2 text-green-600">
            {stats.shortlisted}
          </p>
        </div>
      </Link>

      <Link to="/recruiter-applicants?status=rejected">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
          <h3>Rejected</h3>
          <p className="text-4xl font-bold mt-2 text-red-600">
            {stats.rejected}
          </p>
        </div>
      </Link>
    </div>

    {/* Bottom Panels */}
    <div className="grid lg:grid-cols-2 gap-8">

      {/* Recent Applicants */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-bold">
            Recent Applicants
          </h3>

          <Link
            to="/my-jobs"
            className="text-blue-600 font-semibold"
          >
            View All →
          </Link>
        </div>

        <div className="space-y-4">
          {stats.recentApplicants?.length === 0 ? (
            <p className="text-gray-500">
              No applicants yet
            </p>
          ) : (
            stats.recentApplicants?.map((app) => (
              <Link
                key={app._id}
                to={`/applicants/${app.job?._id}`}
                className="block"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-xl hover:scale-[1.02] transition cursor-pointer">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                      {app.candidate?.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <p className="font-bold">
                        {app.candidate?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {app.candidate?.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 border-t pt-3">
                    <p className="text-sm text-gray-500">
                      Applied For
                    </p>

                    <p className="font-semibold">
                      {app.job?.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-bold">
            Recent Jobs
          </h3>

          <Link
            to="/my-jobs"
            className="text-emerald-600 font-semibold"
          >
            Manage →
          </Link>
        </div>

        <div className="space-y-4">
          {stats.recentJobs?.length === 0 ? (
            <p className="text-gray-500">
              No jobs yet
            </p>
          ) : (
            stats.recentJobs?.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="block"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 hover:shadow-xl hover:scale-[1.02] transition">
                  <h4 className="font-bold text-lg">
                    {job.title}
                  </h4>

                  <p className="text-gray-600">
                    {job.company}
                  </p>

                  <div className="mt-3 flex justify-between">
                    <span className="text-sm text-gray-500">
                      📍 {job.location}
                    </span>

                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );
}

export default Dashboard;