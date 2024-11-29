import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState(""); // Menggunakan username
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // navigate state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://fimbackend.vercel.app/user/login", {
        username,
        password,
      });

      setMessage(response.data.message || "Login successful");

      if (response.status === 200) {
        // Menavigasi ke halaman /dashboard dengan membawa state username
        navigate("/dashboard", {
          state: {
            username: username, // Mengirim username
          },
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("Internal Server Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: "#1C1C1C" }}>
      <div className="p-8 rounded shadow-md w-full max-w-md flex flex-col justify-center" style={{ backgroundColor: "#FFFFFF" }}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#000000" }}>
          Login User
        </h2>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="../assets/Logo FIM.png" alt="Logo FIM" className="w-32 h-32" />
        </div>

        {/* Deskripsi Proyek */}
        <p className="text-center mb-6" style={{ color: "#333333" }}>
          <strong>Farm Integrated Monitoring</strong> merupakan aplikasi yang digunakan untuk membantu petani melon dalam mengelola perkebunan mereka dengan memanfaatkan teknologi IoT dan Software Engineering.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="username" style={{ color: "#333333" }}>
              Username
            </label>
            <input type="text" id="username" className="w-full p-2 border-2 rounded" style={{ borderColor: "#333333", color: "#000000" }} value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block mb-2" htmlFor="password" style={{ color: "#333333" }}>
              Password
            </label>
            <input type="password" id="password" className="w-full p-2 border-2 rounded" style={{ borderColor: "#333333", color: "#000000" }} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {message && (
            <p className="mb-4 text-center" style={{ color: "#FF0000" }}>
              {message}
            </p>
          )}
          <button type="submit" className="w-full py-2 rounded hover:bg-white hover:text-black border-2 border-black" style={{ backgroundColor: "#000000", color: "#FFFFFF" }}>
            Login
          </button>
        </form>

        <div className="text-center m-2">
          <a href="/register" className="text-sm duration-150 hover:text-gray-500" style={{ color: "#000000" }}>
            or Sign Up for new user
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
