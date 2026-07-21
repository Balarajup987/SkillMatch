import { useEffect, useState } from "react";
import axios from "axios";

function AdminCandidates() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    const fetchCandidates = async () => {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/candidates",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(res.data);

    };

    fetchCandidates();

  }, []);

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Candidates
      </h1>

      {users.map((user) => (

        <div
          key={user._id}
          className="bg-white shadow rounded-lg p-4 mb-4"
        >

          <a
            href={`/admin/user/${user._id}`}
            className="text-blue-600 font-bold hover:underline"
          >
            {user.name}
          </a>

          <p>{user.email}</p>

        </div>

      ))}

    </div>

  );

}

export default AdminCandidates;