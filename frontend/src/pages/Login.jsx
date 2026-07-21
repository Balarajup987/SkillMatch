import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {Eye,EyeOff} from "lucide-react";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] =
useState("");
const [message, setMessage] =
useState("");
const [showPassword, setShowPassword] =
  useState(false);

const handleSubmit = async (e) => {
e.preventDefault();


try {
  const res = await axios.post(
    "http://localhost:5000/api/auth/login",
    { email, password }
  );

  localStorage.setItem(
    "token",
    res.data.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(res.data.user)
  );

  console.log("Role:",res.data.user.role);
  
  if (res.data.user.role === "admin") {
  window.location.href = "/admin/dashboard";
} else {
  window.location.href = "/dashboard";
  }

} catch (error) {
  setMessage(
    error.response?.data?.message ||
      "Something went wrong"
  );
}


};

return ( <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center px-4">


  <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

    <h1 className="text-4xl font-bold text-center text-black mb-2">
      SkillMatch
    </h1>

    <p className="text-center text-gray-500 mb-8">
      Welcome Back
    </p>

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
      />

     <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter Password"
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
    className="w-full px-4 py-3 pr-14 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
  />

    <button
    type="button"
    onClick={() =>
    setShowPassword(!showPassword)
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover"
    
    >
    
    
    {showPassword ?( <EyeOff size={20}/>):(<Eye size={20}/>)}
    

  </button>
</div>


      {message && (
        <p className="text-red-500 text-sm">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
      >
        Login
      </button>
    </form>

    <div className="flex items-center my-6">
      <div className="flex-1 h-px bg-gray-300"></div>
      <span className="px-4 text-gray-400">
        OR
      </span>
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>

  

    <p className="text-center text-gray-500 mt-6">
      New user?{" "}
      <Link
        to="/signup"
        className="text-blue-600 font-semibold"
      >
        Sign Up
      </Link>
    </p>
  </div>
</div>


);
}

export default Login;
