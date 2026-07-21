import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyJobs() {
  const [message,setMessage]=useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/jobs/my-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setJobs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

 const handleDelete = async (id) => {
  try {
    const token =
      localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/jobs/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    setJobs(
      jobs.filter(
        (job) => job._id !== id
      )
    );
    setMessage("Job deleted Successfully✅");
  } catch (error) {
    console.log(error);
  }
};

  if (loading) {
    return (
      <h1 className="text-3xl p-10">
        Loading...
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-cyan-50 p-6 md:p-10">
      
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border-l-8 border-orange-500">
        <h1 className="text-4xl font-bold text-gray-800">
          My Jobs
        </h1>

        <p className="text-gray-500 mt-2">
          Manage all jobs posted by you
        </p>
      </div>
      {message && (
  <div className="mb-6 p-4 rounded-2xl bg-green-100 text-green-700 font-semibold shadow">
    {message}
  </div>
)}

      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-700">
            No Jobs Posted Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Create your first job posting
          </p>

          <Link to="/create-job">
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Create Job
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-800">
                  {job.title}
                </h3>

                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                  Active
                </span>
              </div>

              <p className="text-gray-600 mt-3 font-medium">
                {job.company}
              </p>

              <p className="text-gray-500 mt-2">
                📍 {job.location}
              </p>

              <p className="text-purple-600 font-bold mt-4 text-lg">
                ₹ {job.salary}
              </p>

              <div className="grid grid-cols-3 gap-3 mt-8">
                <Link to={`/applicants/${job._id}`}>
                  <button className="w-full py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600">
                    Applicants
                  </button>
                </Link>

                <Link to={`/edit-job/${job._id}`}>
                  <button className="w-full py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600">
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() =>
                    handleDelete(job._id)
                  }
                  className="w-full py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyJobs;