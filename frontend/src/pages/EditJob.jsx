import { useEffect, useState } from "react";
import api from "../api";
import { useParams ,useNavigate} from "react-router-dom";

function EditJob() {
  const { id } = useParams();
   const navigate = useNavigate();
  const [message, setMessage] =
    useState("");

  const [title, setTitle] =
    useState("");
  const [company, setCompany] =
    useState("");
  const [location, setLocation] =
    useState("");
  const [salary, setSalary] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [requirements, setRequirements] =
    useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(
          `jobs/${id}`
        );

        const job = res.data;

        setTitle(job.title);
        setCompany(job.company);
        setLocation(job.location);
        setSalary(job.salary);
        setDescription(job.description);
        setRequirements(
          job.requirements.join(", ")
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchJob();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await api.put(
        `/jobs/${id}`,
        {
          title,
          company,
          location,
          salary,
          description,
          requirements: requirements
            .split(",")
            .map((req) => req.trim())
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setMessage(
        "Job Updated Successfully ✅"
      );
      setTimeout(() => {
  navigate("/my-jobs");
}, 1000);
    } catch (error) {
      console.log(error);
      setMessage("Update Failed ❌");
    }
  };

  return (
   
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold mb-2">
          Edit Job
        </h1>

        <p className="text-gray-500 mb-8">
          Update job details
        </p>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-blue-100 text-blue-700 font-semibold">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">
              Job Title
            </label>

            <input
              className="w-full border rounded-xl p-3"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Company
            </label>

            <input
              className="w-full border rounded-xl p-3"
              value={company}
              onChange={(e) =>
                setCompany(e.target.value)
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Location
            </label>

            <input
              className="w-full border rounded-xl p-3"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Salary
            </label>

            <input
              className="w-full border rounded-xl p-3"
              value={salary}
              onChange={(e) =>
                setSalary(e.target.value)
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-2">
            Description
          </label>

          <textarea
            rows="5"
            className="w-full border rounded-xl p-3"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />
        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-2">
            Requirements
          </label>

          <input
            className="w-full border rounded-xl p-3"
            value={requirements}
            onChange={(e) =>
              setRequirements(
                e.target.value
              )
            }
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xl font-bold hover:scale-[1.01] transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditJob;