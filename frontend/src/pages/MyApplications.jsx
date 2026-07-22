import { useEffect, useState } from "react";
import api from "../api";
import { useSearchParams } from "react-router-dom";

function MyApplications() {
const [applications, setApplications] =
useState([]);

const [loading, setLoading] =
useState(true);

const [searchParams] =
useSearchParams();

const statusFilter =
searchParams.get("status");

const user = JSON.parse(
localStorage.getItem("user")
);

useEffect(() => {
const fetchApplications =
async () => {
try {
const token =
localStorage.getItem(
"token"
);
    const res =
        await api.get(
          "/applications/my-applications",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setApplications(
        res.data
      );
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

fetchApplications();

}, []);

if (user?.role !== "candidate") {
return ( <h1 className="text-3xl p-10 text-red-500">
Access Denied </h1>
);
}

if (loading) {
return ( <h1 className="text-3xl p-10">
Loading... </h1>
);
}

const filteredApplications =
statusFilter
? applications.filter(
(app) =>
app.status ===
statusFilter
)
: applications;
console.log(applications);

return ( <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8"> <h1 className="text-4xl font-bold mb-2">
My Applications </h1>

  <p className="text-gray-600 mb-8">
    {statusFilter
      ? `Showing ${statusFilter} applications`
      : "Showing all applications"}
  </p>

  {filteredApplications.length ===
  0 ? (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      No applications found
    </div>
  ) : (
    <div className="grid gap-6">
      {filteredApplications.map(
        (app) => (
          <div
            key={app._id}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-bold">
              {app.job?.title}
            </h2>

            <p className="text-gray-500 mt-2">
              {
                app.job
                  ?.company
              }
            </p>

            <p className="mt-4">
              Status:
              <span
                className={`ml-2 font-bold ${
                  app.status ===
                  "shortlisted"
                    ? "text-green-600"
                    : app.status ===
                      "rejected"
                    ? "text-red-600"
                    : "text-yellow-500"
                }`}
              >
                {app.status}
              </span>
            </p>
            {app.interviewStatus === "scheduled" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="font-semibold text-blue-700">
                  Interview Scheduled
                </p>
            
                <p className="mt-2">
                  Date:
                  <span className="ml-2 font-bold">
                    {new Date(
                      app.interviewDate
                    ).toLocaleString()}
                  </span>
                </p>

              <a
                href={app.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 px-4 py-2 rounded-lg bg-blue-500 text-white"
              >
                Join Meeting
              </a>
              </div>
            )}
          </div>
        )
      )}
    </div>
  )}
</div>

);
}

export default MyApplications;
