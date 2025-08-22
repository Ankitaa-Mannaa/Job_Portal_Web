import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "../../assets/Login bg.jpg";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        form
      );
      setSuccess(res.data.msg || "Registration successful");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Animated Form */}
      <motion.div
        initial={{ x: "100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100vw", opacity: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        className="relative w-[90%] max-w-md bg-white/15 backdrop-blur-lg p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Register</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {success && <p className="text-green-400 mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="italic w-full border px-4 py-2 mb-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full italic border px-4 py-2 mb-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full italic border px-4 py-2 mb-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full italic text-gray-700 border px-4 py-2 mb-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="candidate">Candidate</option>
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full h-auto bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 rounded-full font-bold hover:opacity-90 transition"
          >
            Register Now
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-200">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline font-semibold">
            Login here
          </Link>
        </p>

        <p className="text-xs text-black mt-6 text-center">
          By clicking on "Register Now" you agree to our{" "}
          <a href="#" className="text-blue-800 hover:underline">
            Terms of Service
          </a>{" "}
          |{" "}
          <a href="#" className="text-blue-800 hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
