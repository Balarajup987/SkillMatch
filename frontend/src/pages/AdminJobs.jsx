import { useEffect, useState } from "react";
import axios from "axios";

function AdminJobs() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {

    const fetchJobs = async () => {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    //   console.log(res.data);
      setJobs(res.data.jobs);

    };

    fetchJobs();

  }, []);

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        All Jobs
      </h1>

      {jobs.map((job) => (

        <div
          key={job._id}
          className="bg-white shadow rounded-lg p-5 mb-4"
        >

          <h2 className="text-xl font-bold">
            {job.title}
          </h2>

          <p>{job.company}</p>

          <p>{job.location}</p>

        </div>

      ))}

    </div>

  );

}

export default AdminJobs;