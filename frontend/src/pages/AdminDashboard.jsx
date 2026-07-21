import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {

      const statsRes = await axios.get(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats(statsRes.data);

      const usersRes = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(usersRes.data);

    } catch (error) {
      console.log(error);
    }
  };

 useEffect(() => {
  const loadData = async () => {
    await fetchDashboard();
  };

  loadData();
}, []);

const restrictUser = async (id) => {

  try {

    await axios.put(
      `http://localhost:5000/api/admin/users/${id}/restrict`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchDashboard();

  } catch (error) {
    console.log(error);
  }

};
  const unrestrictUser = async (id) => {

  try {

    await axios.put(
      `http://localhost:5000/api/admin/users/${id}/unrestrict`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchDashboard();

  } catch (error) {
    console.log(error);
  }
};

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8 text-center">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
      
        <div
        onClick={() =>
        window.location.href="/admin/candidates"
        }
        className="cursor-pointer bg-white rounded-xl shadow p-6 text-center hover:shadow-xl"
        >
          <h2 className="text-xl font-semibold">Candidates</h2>
          <p className="text-4xl font-bold text-blue-600 mt-3">
            {stats.totalCandidates}
          </p>
        </div>
      
        <div
         onClick={() =>
         window.location.href="/admin/recruiters"
         }
         className="cursor-pointer bg-white rounded-xl shadow p-6 text-center hover:shadow-xl"
         >
          <h2 className="text-xl font-semibold">Recruiters</h2>
          <p className="text-4xl font-bold text-green-600 mt-3">
            {stats.totalRecruiters}
          </p>
        </div>
      
        <div
          onClick={() =>
          window.location.href="/admin/jobs"
          }
          className="cursor-pointer bg-white rounded-xl shadow p-6 text-center hover:shadow-xl"
        >
          <h2 className="text-xl font-semibold">Jobs</h2>
          <p className="text-4xl font-bold text-purple-600 mt-3">
            {stats.totalJobs}
          </p>
        </div>
      
      </div>

      {/* Users */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-5">
          Manage Users
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-3 text-left">Name</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">Role</th>

              <th className="p-3 text-center">
                Violations
              </th>

              <th className="p-3 text-center">
                Status
              </th>

              <th className="p-3 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user._id}
                className="border-b hover:bg-gray-100"
              >

                <td className="p-3">
                  {user.name}
                </td>

                <td className="p-3">
                  {user.email}
                </td>

                <td className="p-3 capitalize">
                  {user.role}
                </td>

                <td className="p-3 text-center">
                  {user.violationCount}
                </td>

                <td className="p-3 text-center">

                  {user.isRestricted ? (

                    <span className="text-red-600 font-bold">
                      Restricted
                    </span>

                  ) : (

                    <span className="text-green-600 font-bold">
                      Active
                    </span>

                  )}

                </td>

                <td className="p-3 text-center">

                  {user.role !== "admin" && (

                    user.isRestricted ? (
                  
                      <button
                        onClick={() => unrestrictUser(user._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Unrestrict
                      </button>
                  
                    ) :  (

                        <button
                          onClick={() => restrictUser(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                          Restrict
                        </button>
                    
                      )
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default AdminDashboard;