import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    img_url: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const checkUsernameExists = async (username) => {
    try {
      const response = await axios.get("https://fimbackend.vercel.app/user/getAllUser");

      if (response.status === 200) {
        const users = response.data;

        if (Array.isArray(users)) {
          for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
              return true;
            }
          }
          return false;
        } else {
          console.error("Expected an array but got:", users);
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error("Error fetching users:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to check username. Please try again.",
      });

      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please upload an image!",
      });
      return;
    }

    try {
      const usernameExists = await checkUsernameExists(formData.username);
      if (usernameExists) {
        Swal.fire({
          icon: "warning",
          title: "Username Taken",
          text: "Username already exists. Please choose another one.",
        });
        return;
      }

      const imageData = new FormData();
      imageData.append("image", imageFile);

      const uploadResponse = await axios.post("https://fimbackend.vercel.app/cloudinary/upload", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.status === 200) {
        const img_url = uploadResponse.data;

        const updatedFormData = { ...formData, img_url };

        const response = await axios.post("https://fimbackend.vercel.app/user/signup", updatedFormData);
        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "Your account has been created successfully!",
          });

          setFormData({
            nama: "",
            username: "",
            password: "",
            img_url: "",
          });
          setImageFile(null);
        } else {
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: "Failed to register user. Please try again.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: "Failed to upload profile picture. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Internal Server Error",
        text: "An error occurred. Please try again later.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: "black" }}>
      <form className="flex flex-col bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Register</h2>
        <div className="mb-4">
          <label className="block mb-2 text-black">Nama</label>
          <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full p-2 border-2 border-black rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-black">Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border-2 border-black rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-black">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border-2 border-black rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-black">Upload Profile Picture</label>
          <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 border-2 border-black rounded" required />
        </div>
        <button type="submit" className="w-full py-2 rounded bg-black text-white hover:bg-gray-800">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
