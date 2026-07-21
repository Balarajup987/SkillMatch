import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Applicants() {
  const { id } = useParams();
  const [applicants, setApplicants] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/applications/${id}/applicants`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        setApplicants(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id]);

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? {
                ...app,
                status
              }
            : app
        )
      );
    } catch (error) {
      console.log(
        error.response?.data
      );
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
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-l-8 border-blue-500">
        <h1 className="text-4xl font-bold">
          Applicants
        </h1>
        <p className="text-gray-500 mt-2">
          Review candidates
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
          No applicants yet
        </div>
      ) : (
        <div className="space-y-6">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              {/* Top */}
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                    {app.candidate.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      {
                        app.candidate
                          .name
                      }
                    </h2>

                    <p className="text-gray-500">
                      {
                        app.candidate
                          .email
                      }
                    </p>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full font-semibold ${
                    app.status ===
                    "shortlisted"
                      ? "bg-green-100 text-green-700"
                      : app.status ===
                        "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* Resume + ATS */}
              <div className="flex gap-4 mt-6 flex-wrap">
                <a
                  href={`http://localhost:5000/${app.resumeUrl.replaceAll(
                    "\\",
                    "/"
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white"
                >
                  View Resume
                </a>

                <div className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 font-bold">
                  ATS Score:
                  {app.atsScore}%
                </div>
              </div>

              {/* Strengths */}
              <div className="mt-6">
                <h3 className="font-bold mb-2">
                  Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {app.strengths?.map(
                    (
                      item,
                      index
                    ) => (
                      <span
                        key={
                          index
                        }
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="mt-6">
                <h3 className="font-bold mb-2">
                  Weaknesses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {app.weaknesses?.map(
                    (
                      item,
                      index
                    ) => (
                      <span
                        key={
                          index
                        }
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Suggestions */}
              <div className="mt-6 bg-orange-50 p-4 rounded-2xl">
                <h3 className="font-bold mb-2">
                  Suggestions
                </h3>

                <ul className="list-disc ml-5 text-gray-700">
                  {app.suggestions?.map(
                    (
                      item,
                      index
                    ) => (
                      <li
                        key={
                          index
                        }
                      >
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() =>
                    updateStatus(
                      app._id,
                      "shortlisted"
                    )
                  }
                  className="py-3 rounded-xl bg-green-500 text-white hover:bg-green-600"
                >
                  Shortlist
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app._id,
                      "rejected"
                    )
                  }
                  className="py-3 rounded-xl bg-red-500 text-white hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applicants;