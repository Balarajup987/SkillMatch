import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Navbar() {
const user = JSON.parse(
localStorage.getItem("user")
);

const firstLetter =
user?.name?.charAt(0).toUpperCase();

const [showMenu, setShowMenu] =
useState(false);
const [search, setSearch] = useState("");
const [unreadCount,setUnreadCount]=useState(0);

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (
        !token ||
        user?.role !== "candidate"
      ) {
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const unread = res.data.filter(
        (n) => !n.read
      ).length;

      setUnreadCount(unread);
    } catch (error) {
      console.log(error);
    }
  };

  fetchNotifications();
}, []);

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
window.location.href = "/login";
};


const handleSearch = () => {
  window.location.href =
    `/jobs?search=${search}`;
};

return (
<div
style={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
padding: "15px 30px",
position: "relative",
boxShadow:
"0 2px 8px rgba(0,0,0,0.1)"
}}
>
<Link
to={user?.role==="admin" ? "/admin/dashboard":"/dashboard"}
style={{
textDecoration: "none",
display: "flex",
alignItems: "center",
gap: "10px"
}}
>
<div
style={{
width: "42px",
height: "42px",
borderRadius: "50%",
background:
"linear-gradient(135deg, #2563eb, #7c3aed)",
color: "white",
display: "flex",
justifyContent: "center",
alignItems: "center",
fontWeight: "bold"
}}
>
SM </div>
    <span
      style={{
        fontSize: "28px",
        fontWeight: "bold",
        color: "#2563eb"
      }}
    >
      SkillMatch
    </span>
  </Link>

  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }}
>
  <span
    style={{
      fontWeight: "bold"
    }}
  >
    Search Jobs
  </span>

<input
type="text"
placeholder="Search jobs..."
value={search}
onChange={(e) =>
setSearch(e.target.value)
}
style={{
padding: "10px",
width: "250px",
borderRadius: "8px",
border: "1px solid gray"
}}
/>
  <button onClick={handleSearch}>
    Search
  </button>

  {user?.role === "candidate" && (
  <Link
    to="/notifications"
    style={{
      position: "relative",
      textDecoration: "none",
      fontSize: "26px"
    }}
  >
    🔔

    {unreadCount > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-8px",
          right: "-12px",
          backgroundColor: "red",
          color: "white",
          borderRadius: "50%",
          minWidth: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "bold"
        }}
      >
        {unreadCount}
      </span>
    )}
  </Link>
)}

</div>


  <div
    onClick={() =>
      setShowMenu(!showMenu)
    }
    style={{
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      backgroundColor: "#2563eb",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "18px"
    }}
  >
    {firstLetter}
  </div>

  {showMenu && (
    <div
      style={{
        position: "absolute",
        right: "20px",
        top: "70px",
        backgroundColor: "white",
        border:
          "1px solid lightgray",
        padding: "20px",
        borderRadius: "10px",
        minWidth: "180px",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.15)"
      }}
    >
      <Link to="/profile">
        Profile
      </Link>

      <br />
      <br />

      <Link to="/jobs">
        Jobs
      </Link>

      {user?.role ===
        "candidate" && (
        <>
          <br />
          <br />
          <Link to="/my-applications">
            My Applications
          </Link>
        </>
      )}

      {user?.role ===
        "recruiter" && (
        <>
          <br />
          <br />
          <Link to="/create-job">
            Create Job
          </Link>

          <br />
          <br />

          <Link to="/my-jobs">
            My Jobs
          </Link>
        </>
      )}

      <br />
      <br />

      <button
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>

);
}

export default Navbar;
