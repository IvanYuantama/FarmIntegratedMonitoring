import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const currentUsername = location.state?.username;

  useEffect(() => {
    if (!currentUsername) {
      console.error("Username tidak ditemukan!");
      navigate("/error", {
        state: {
          username: currentUsername, // Mengirim username
        },
      });
      // Menambahkan logika untuk menangani kondisi ini, seperti memberikan alert atau navigasi ke halaman lain
    }
  }, [currentUsername]);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("https://fimbackend.vercel.app/general/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirm.isConfirmed) {
        await axios.put(`https://fimbackend.vercel.app/general/deleteNotif/${id}`);
        Swal.fire("Deleted!", "Your notification has been deleted.", "success");
        fetchNotifications(); // Refresh notifications
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      Swal.fire("Error", "There was a problem deleting the notification.", "error");
    }
  };

  // UseEffect to load notifications on mount
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6">Notifications</h1>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li key={notif.id} className="p-4 border rounded-lg shadow-md bg-gray-50">
                <p className="text-gray-800 font-semibold">{notif.isi}</p>
                <p className="text-sm text-gray-500">From: {notif.from || "Unknown"}</p>
                <p className="text-sm text-gray-400">{new Date(notif.timestamp).toLocaleString()}</p>
                <button onClick={() => deleteNotification(notif.id)} className="mt-2 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
