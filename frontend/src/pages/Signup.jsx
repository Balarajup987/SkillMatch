import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] =
useState("");
const [role, setRole] =
useState("candidate");
const [message, setMessage] =
useState("");
const [isError, setIsError] =
useState(false);
const [showPassword, setShowPassword] =
useState(false);
const [passwordStrength,
setPasswordStrength] =
useState("");

const checkPasswordStrength =
(value) => {
let score = 0;

  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[@$!%*?&]/.test(value))
    score++;

  if (score <= 1)
    setPasswordStrength("Weak");
  else if (score <= 3)
    setPasswordStrength("Medium");
  else
    setPasswordStrength("Strong");
};


const handleSubmit = async (e) => {
e.preventDefault();


const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  setIsError(true);
  setMessage("Enter valid email");
  return;
}

try {
  await axios.post(
    "http://localhost:5000/api/auth/signup",
    {
      name,
      email,
      password,
      role
    }
  );

  setIsError(false);
  setMessage(
    "Signup successful! Redirecting..."
  );

  setTimeout(() => {
    window.location.href =
      "/login";
  }, 2000);

} catch (error) {
  setIsError(true);
  setMessage(
    error.response?.data?.message ||
      error.message
  );
}

};

return ( <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center px-4">

  <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl hover:shadow-blue-200 transition-all duration-300 p-7">

    <h1 className="text-3xl font-bold text-center text-black mb-2">
      SkillMatch
    </h1>

    <p className="text-center text-gray-500 mb-6">
      Create your account
    </p>

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        placeholder="Enter Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
      />

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
      />

      <div className="relative">
        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(
              e.target.value
            );
            checkPasswordStrength(
              e.target.value
            );
          }}
          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>

      {password && (
        <p
          className={`text-sm ${
            passwordStrength ===
            "Weak"
              ? "text-red-500"
              : passwordStrength ===
                "Medium"
              ? "text-yellow-500"
              : "text-green-600"
          }`}
        >
          Password Strength:{" "}
          {passwordStrength}
        </p>
      )}

      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value)
        }
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <option value="candidate">
          Candidate
        </option>
        <option value="recruiter">
          Recruiter
        </option>
      </select>

      {message && (
        <p
          className={`text-sm ${
            isError
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
      >
        Sign Up
      </button>
    </form>

    <p className="text-center text-gray-500 mt-6">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-blue-600 font-semibold"
      >
        Login
      </Link>
    </p>
  </div>
</div>
);
}

export default Signup;
