import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(
          `/jobs/${id}`
        );
        setJob(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) return <h1 className="p-6">Loading...</h1>;

  const handleApply = async () => {
    try {
      if (!resume) {
        setMessage("Upload resume first");
        return;
      }

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("resume", resume);

      const uploadRes = await api.post(
        "/upload/resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      await api.post(
        `/applications/${id}/apply`,
        { resumeUrl: uploadRes.data.filePath },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Applied Successfully ✅");
    } catch (error) {
      setMessage(error.response?.data?.message);
    }
  };

  const matchedSkills =
    job?.requirements?.filter(skill =>
      user?.skills?.some(
        s => s.toLowerCase() === skill.toLowerCase()
      )
    ) || [];

  const matchScore = job?.requirements?.length
    ? Math.round(
        (matchedSkills.length / job.requirements.length) * 100
      )
    : 0;

  return (
    <div className="bg-gray-100 py-6 px-3">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-4">

        <h1 className="text-2xl font-bold">
          {job.title}
        </h1>

        <p className="text-gray-600">
          {job.company}
        </p>

        <div className="flex gap-3 mt-3 text-sm flex-wrap">
          <span className="bg-blue-100 px-3 py-1 rounded-full">
            📍 {job.location}
          </span>

          <span className="bg-green-100 px-3 py-1 rounded-full">
            ₹ {job.salary}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          {job.description}
        </p>

        <div className="mt-4">
          <p className="font-semibold mb-2">
            Skills Required
          </p>

          <div className="flex flex-wrap gap-2">
            {job.requirements?.map((skill, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-gray-50 p-3 rounded-xl">
          <p className="font-semibold">
            Match Score: {matchScore}%
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {matchedSkills.join(", ") || "No matched skills"}
          </p>
        </div>

        <div className="mt-4">
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setResume(e.target.files[0])
            }
            className="hidden"
          />
          
          <label
            htmlFor="resume-upload"
            className="cursor-pointer flex items-center justify-center w-full border-2 border-dashed border-blue-400 rounded-xl p-4 bg-blue-50 hover:bg-blue-100 transition"
          >
            <span className="font-semibold text-blue-700">
              {resume
                ? `📄 ${resume.name}`
                : "Click to Upload Resume"}
            </span>
          </label>
        </div>

        {message && (
          <p className="mt-3 text-sm text-blue-600">
            {message}
          </p>
        )}

        <button
          onClick={handleApply}
          className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobDetails;