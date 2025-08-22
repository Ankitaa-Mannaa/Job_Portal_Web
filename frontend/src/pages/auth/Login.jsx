import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import bgImage from "../../assets/Login bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        { email, password }
      );

      const token = res.data.access_token;
      login(token);

      const decoded = jwtDecode(token);
      const role = decoded.sub.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "company") {
        navigate("/company");
      } else {
        navigate("/candidate");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-black/50 w-full min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-24 flex flex-col lg:flex-row items-center justify-between text-white">
          {/* Left Section */}
          <div className="w-1/2 mb-12 lg:mb-0 font-['Poppins']">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              LET'S GET STARTED!
            </h1>
            <p className="italic text-2xl max-w-lg mb-6 text-yellow-300 drop-shadow-lg">
              Thousands of top companies are hiring right now. Build your
              profile, apply in one click, and take the next step in your career
              journey!
            </p>

            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Right Section (Login Form) */}
          <div className="w-full lg:w-1/3 bg-white/15 backdrop-blur-md p-8 rounded-lg shadow-xl text-gray-900">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            {error && (
              <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
              <label className="italic block mb-2 text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                className="w-full border px-3 py-2 mb-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="italic block mb-2 text-sm font-medium">Password</label>
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex items-center justify-between mb-5">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="h-4 w-4" />
                  <span>Remember Me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-900 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full h-auto bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 rounded-full font-bold hover:opacity-90 transition"
              >
                Login now
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-900">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-orange-500 font-semibold hover:underline"
              >
                Register here
              </Link>
            </p>

            <p className="text-xs text-gray-900 mt-6 text-center">
              By clicking on "Login now" you agree to our{" "}
              <a href="#" className="text-blue-900 hover:underline">
                Terms of Service
              </a>{" "}
              |{" "}
              <a href="#" className="text-blue-900 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
