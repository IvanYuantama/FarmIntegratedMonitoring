import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AutomationPage = () => {
  const [device, setDevice] = useState(""); // State for selected device
  const [time, setTime] = useState(""); // State for automation time
  const [status, setStatus] = useState("on"); // State for device status (default 'on')
  const [automations, setAutomations] = useState([]); // State for automation data
  const [message, setMessage] = useState(""); // Notification message

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

  // Fetch automation data from backend when component mounts
  useEffect(() => {
    fetchAutomations();
  }, []);

  useEffect(() => {
    const interval = setInterval(checkAutomation, 60000); // Check every minute
    return () => clearInterval(interval); // Clear interval on unmount
  }, [automations]);

  const fetchAutomations = async () => {
    try {
      const response = await axios.get("https://fimbackend.vercel.app/general/automation");
      setAutomations(response.data);
    } catch (error) {
      console.error("Failed to fetch automations", error);
    }
  };

  const checkAutomation = () => {
    // Create a new Date object
    const currentDate = new Date();

    // Format time to 'HH:mm:00' (24-hour format)
    const currentTime = `${currentDate.getHours().toString().padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}:00`;

    console.log(currentTime);

    automations.forEach(async (automation) => {
      if (automation.time === currentTime) {
        const apiUrl =
          automation.device === "Pompa Air"
            ? `https://sgp1.blynk.cloud/external/api/update?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v1=${automation.status === "on" ? 1 : 0}`
            : `https://sgp1.blynk.cloud/external/api/update?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v0=${automation.status === "on" ? 1 : 0}`;

        try {
          await axios.get(apiUrl);
          console.log(`${automation.device} turned ${automation.status} at ${currentTime}`);
        } catch (error) {
          console.error("Failed to update device", error);
        }
      } else {
        console.log(automation.time);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!device || !time) {
      setMessage("Device, Time, and Status are required.");
      return;
    }

    // Update device status through the Blynk API
    const apiUrl =
      device === "Pompa Air"
        ? `https://sgp1.blynk.cloud/external/api/update?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v1=${status === "on" ? 1 : 0}`
        : `https://sgp1.blynk.cloud/external/api/update?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v0=${status === "on" ? 1 : 0}`;

    try {
      // Save automation to backend
      await axios.post("https://fimbackend.vercel.app/general/automation", {
        device,
        time,
        status,
      });

      setMessage("Automation successfully saved!");
      setDevice("");
      setTime("");
      setStatus("on");

      // Refresh automation data
      fetchAutomations();
    } catch (error) {
      console.error("Failed to save automation", error);
      setMessage("Failed to save automation.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Form for automation */}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Automation Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700" htmlFor="device">
              Select Device
            </label>
            <select id="device" className="w-full p-2 border border-gray-300 rounded" value={device} onChange={(e) => setDevice(e.target.value)} required>
              <option value="">-- Select --</option>
              <option value="Pompa Air">Pompa Air</option>
              <option value="Lampu">Lampu</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700" htmlFor="time">
              Automation Time
            </label>
            <input type="time" id="time" className="w-full p-2 border border-gray-300 rounded" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700" htmlFor="status">
              Select Status
            </label>
            <select id="status" className="w-full p-2 border border-gray-300 rounded" value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>
          {message && <p className="mb-4 text-center text-green-500">{message}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Save Automation
          </button>
        </form>
      </div>

      {/* Table to display automation data */}
      <div className="mt-8 w-full max-w-4xl bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Automation List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">ID</th>
              <th className="border border-gray-300 p-2 text-left">Device</th>
              <th className="border border-gray-300 p-2 text-left">Time</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {automations.map((automation) => (
              <tr key={automation.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{automation.id}</td>
                <td className="border border-gray-300 p-2">{automation.device}</td>
                <td className="border border-gray-300 p-2">{automation.time}</td>
                <td className="border border-gray-300 p-2">{automation.status}</td>
                <td className="border border-gray-300 p-2">{new Date(automation.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutomationPage;
