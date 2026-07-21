import { useState } from "react";
import axios from "axios";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const firstLetter = user?.name?.charAt(0).toUpperCase();

  const [education, setEducation] = useState(user?.education || "");
  const [experience, setExperience] = useState(user?.experience || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      let uploadedFilePath = user?.resumeUrl || "";

      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);

        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload/resume",
          formData
        );

        uploadedFilePath = uploadRes.data.filePath;
      }

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        {
          education,
          experience,
          resumeUrl: uploadedFilePath,
          skills: skills.split(",").map((s) => s.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile Updated Successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="bg-emerald-600 text-white rounded-3xl p-8 shadow-lg mb-8">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <p className="mt-2 text-lg opacity-90">
          Manage your personal information
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
              {firstLetter}
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              {user?.name}
            </h2>

            <p className="text-gray-500">
              {user?.email}
            </p>

            <span className="mt-4 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold capitalize">
              {user?.role}
            </span>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 rounded-xl bg-purple-50 border-l-4 border-purple-500">
              <p className="text-sm text-gray-500">Skills</p>
              <p className="font-semibold">
                {user?.skills?.length
                  ? user.skills.join(", ")
                  : "Not added"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border-l-4 border-emerald-500">
              <p className="text-sm text-gray-500">Resume</p>
              <p className="font-semibold">
                {user?.resumeUrl ? "Uploaded" : "Not Uploaded"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">
            Edit Profile
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">
                Education
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-blue-200 focus:border-blue-500 outline-none"
                placeholder="B.Tech CSE"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Experience
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-orange-200 focus:border-orange-500 outline-none"
                placeholder="Fresher / 2 years"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Skills
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none"
                placeholder="Java, React, MongoDB"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Upload Resume (PDF)
              </label>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full p-3 rounded-xl border-2 border-emerald-200"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white font-bold text-lg hover:scale-[1.01] transition"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;