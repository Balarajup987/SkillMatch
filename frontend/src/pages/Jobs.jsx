import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] =
    useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/jobs"
        );

        setJobs(res.data.jobs);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs();
  }, []);

  const calculateMatch = (
    jobRequirements
  ) => {
    if (
      !jobRequirements?.length ||
      !user?.skills?.length
    )
      return 0;

    let matched = 0;

    for (let req of jobRequirements) {
      if (
        user.skills.some(
          (skill) =>
            skill.toLowerCase() ===
            req.toLowerCase()
        )
      ) {
        matched++;
      }
    }

    return Math.round(
      (matched /
        jobRequirements.length) *
        100
    );
  };

  const filteredJobs = jobs.filter(
    (job) =>
      (job.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        job.company
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      job.location
        .toLowerCase()
        .includes(
          locationFilter.toLowerCase()
        )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 p-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-l-8 border-pink-500">
        <h1 className="text-4xl font-bold">
          Explore Jobs
        </h1>
        <p className="text-gray-500 mt-2">
          Find your dream job
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title/company..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="p-4 rounded-2xl border shadow-sm"
        />

        <input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) =>
            setLocationFilter(
              e.target.value
            )
          }
          className="p-4 rounded-2xl border shadow-sm"
        />
      </div>

      <p className="mb-6 text-lg font-semibold">
        Total Jobs: {filteredJobs.length}
      </p>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => {
          const match =
            calculateMatch(
              job.requirements
            );

          return (
            <div
              key={job._id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <Link to={`/jobs/${job._id}`}>
                <h2 className="text-2xl font-bold hover:text-blue-600">
                  {job.title}
                </h2>
              </Link>

              <p className="mt-3 text-gray-700 font-medium">
                {job.company}
              </p>

              <p className="text-gray-500 mt-2">
                📍 {job.location}
              </p>

              <p className="mt-3 text-purple-600 font-bold text-lg">
                ₹ {job.salary}
              </p>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    match >= 70
                      ? "bg-green-100 text-green-700"
                      : match >= 40
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Match: {match}%
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {job.requirements?.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

              <Link to={`/jobs/${job._id}`}>
                <button className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                  View Details
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Jobs;