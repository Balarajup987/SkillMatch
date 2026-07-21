import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

function RecruiterApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [errorMsg,setErrorMsg]=useState("");

  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    meetingLink: ""
  });

  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/applications/recruiter/all",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setApplications(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/applications/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openScheduleModal = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

 const scheduleInterview = async () => {
  const token = localStorage.getItem("token");

  if (!interviewData.meetingLink.startsWith("http")) {
    setErrorMsg("Please enter valid meeting URL");
    return;
  }

  // Close popup immediately
  setShowModal(false);

  try {
    await axios.put(
      `http://localhost:5000/api/applications/${selectedApp._id}/schedule`,
      {
        interviewDate: `${interviewData.date} ${interviewData.time}`,
        meetingLink: interviewData.meetingLink
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setApplications((prev) =>
  prev.map((app) =>
    app._id === selectedApp._id
      ? {
          ...app,
          interviewStatus: "scheduled",
          interviewDate: `${interviewData.date} ${interviewData.time}`,
          meetingLink: interviewData.meetingLink,
        }
      : app
  )
);

setShowModal(false);
setSelectedApp(null);

setInterviewData({
  date: "",
  time: "",
  meetingLink: "",
});
    // Update applications...
  } catch (error) {
    console.log(error);
  }
};
  const filteredApplications = statusFilter
    ? applications.filter(
        (app) => app.status === statusFilter
      )
    : applications;

  if (loading) {
    return (
      <h1 className="text-3xl p-10">
        Loading...
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-cyan-50 p-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-l-8 border-orange-500">
        <h1 className="text-4xl font-bold">
          Recruiter Applicants
        </h1>

        <p className="text-gray-500 mt-2">
          Manage all job applicants
        </p>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <h2 className="text-2xl font-bold">
            No Applicants Found
          </h2>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                  {app.candidate?.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    {app.candidate?.name}
                  </h2>

                  <p className="text-gray-500">
                    {app.candidate?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <span className="font-semibold">
                    Job:
                  </span>{" "}
                  {app.job?.title}
                </p>

                <p>
                  <span className="font-semibold">
                    Company:
                  </span>{" "}
                  {app.job?.company}
                </p>

                <p>
                  <span className="font-semibold">
                    ATS Score:
                  </span>{" "}
                  <span className="text-blue-600 font-bold">
                    {app.atsScore || 0}%
                  </span>
                </p>

                <p>
                  <span className="font-semibold">
                    Status:
                  </span>

                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm ${
                      app.status === "shortlisted"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </p>
              </div>

              {app.status === "shortlisted" &&
                app.interviewStatus === "scheduled" && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50 border-l-4 border-blue-500">
                    <p className="font-bold text-blue-700">
                      Interview Scheduled
                    </p>

                    <p className="mt-2 text-sm">
                      Date:
                      <span className="ml-2 font-semibold">
                        {new Date(
                          app.interviewDate
                        ).toLocaleString()}
                      </span>
                    </p>

                    <a
                      href={app.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 text-blue-600 font-semibold"
                    >
                      Meeting Link
                    </a>
                  </div>
                )}

              {app.resumeUrl && (
                <a
                  href={`http://localhost:5000/${app.resumeUrl.replaceAll(
                    "\\",
                    "/"
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="mt-4 px-4 py-2 rounded-xl bg-purple-500 text-white cursor-pointer">
                    View Resume
                  </button>
                </a>
              )}

              <div className="mt-6">
                {app.status === "pending" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        updateStatus(
                          app._id,
                          "shortlisted"
                        )
                      }
                      className="py-3 rounded-xl bg-green-500 text-white cursor-pointer"
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
                      className="py-3 rounded-xl bg-red-500 text-white cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {app.status === "shortlisted" &&
                  app.interviewStatus !==
                    "scheduled" && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          openScheduleModal(app)
                        }
                        className="py-3 rounded-xl bg-blue-500 text-white cursor-pointer"
                      >
                        Schedule
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "rejected"
                          )
                        }
                        className="py-3 rounded-xl bg-red-500 text-white cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-[500px]">
            <h2 className="text-2xl font-bold mb-4">
              Schedule Interview
            </h2>

            <input
              type="date"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setInterviewData({
                  ...interviewData,
                  date: e.target.value
                })
              }
            />

            <input
              type="time"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setInterviewData({
                  ...interviewData,
                  time: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Meeting Link"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setInterviewData({
                  ...interviewData,
                  meetingLink:
                    e.target.value
                })
              }
            />

            {errorMsg && (
             <p className="text-red-500 mb-3">
             {errorMsg}
             </p>
            )}

            <button
              onClick={scheduleInterview}
              className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterApplicants;