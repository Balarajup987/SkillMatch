import { useState } from "react";
import api from "../api";

function CreateJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [requirements, setRequirements] = useState("");

  const handleSubmit = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await api.post(
        "/jobs",
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
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(
        "Job Created Successfully ✅"
      );

      setTitle("");
      setCompany("");
      setLocation("");
      setSalary("");
      setDescription("");
      setRequirements("");
    } catch (error) {
      setMessage("Failed to Create Job ❌");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold mb-2">
          Create Job
        </h1>

        <p className="text-gray-500 mb-8">
          Post a new opportunity for candidates
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
              placeholder="Software Developer"
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
              placeholder="Google"
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
              placeholder="Hyderabad"
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
              placeholder="1000000"
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
            placeholder="Describe job role..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-2">
            Requirements
          </label>

          <input
            className="w-full border rounded-xl p-3"
            placeholder="React, Node, MongoDB"
            value={requirements}
            onChange={(e) =>
              setRequirements(
                e.target.value
              )
            }
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold hover:scale-[1.01] transition"
        >
          Create Job
        </button>
      </div>
    </div>
  );
}

export default CreateJob;