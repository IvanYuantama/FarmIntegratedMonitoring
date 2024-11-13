import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaBell } from "react-icons/fa"; // Import an icon library for the bell icon

const BlynkDashboard = () => {
  const [v1, setV1] = useState(0);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [ldr, setLdr] = useState(null);

  const updateV1 = async () => {
    const newValue = v1 === 0 ? 1 : 0;
    try {
      await axios.get(`https://sgp1.blynk.cloud/external/api/update?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v1=${newValue}`);
      setV1(newValue);
    } catch (error) {
      console.error("Error updating v1:", error);
    }
  };

  const fetchSensorData = async () => {
    try {
      const tempResponse = await axios.get("https://sgp1.blynk.cloud/external/api/get?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v5");
      const humResponse = await axios.get("https://sgp1.blynk.cloud/external/api/get?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v6");
      const ldrResponse = await axios.get("https://sgp1.blynk.cloud/external/api/get?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v7");
      setTemperature(tempResponse.data);
      setHumidity(humResponse.data);
      setLdr(ldrResponse.data);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex flex-col items-center p-10 bg-gray-100 rounded-2xl w-full max-w-3xl shadow-lg mx-10">
        {/* Header with Title and Buttons */}
        <div className="flex justify-between items-center w-full mb-20">
          <div className="flex space-x-4">
            <button className="bg-black text-xs text-white px-2 py-2 rounded-xl hover:bg-slate-600">Pupuk</button>
            <button className="bg-black text-xs text-white px-3 rounded-xl hover:bg-slate-600">Automisasi</button>
          </div>
          <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
          <div className="flex space-x-4">
            <button className="p-2 bg-yellow-400 text-white rounded-full hover:bg-slate-600">
              <FaBell />
            </button>
            <button className="bg-black text-xs text-white w-24 rounded-lg hover:bg-slate-600">Username</button>
          </div>
        </div>

        {/* Sensor Gauges */}
        <div className="flex justify-around w-full mb-10 space-x-6">
          <div className="flex flex-col items-center w-36 h-36 bg-gray-200 rounded-xl p-4">
            <CircularProgressbar
              value={temperature !== null ? temperature : 0}
              maxValue={50}
              text={`${temperature !== null ? temperature : 0}°C`}
              styles={buildStyles({
                textColor: "#333",
                pathColor: "#FF4500",
                trailColor: "#ddd",
              })}
            />
            <p className="text-sm font-semibold mt-3">Suhu</p>
          </div>

          <div className="flex flex-col items-center w-36 h-36 bg-gray-200 rounded-xl p-4">
            <CircularProgressbar
              value={humidity !== null ? humidity : 0}
              maxValue={100}
              text={`${humidity !== null ? humidity : 0}%`}
              styles={buildStyles({
                textColor: "#333",
                pathColor: "#1E90FF",
                trailColor: "#ddd",
              })}
            />
            <p className="text-sm font-semibold mt-3">Kelembaban</p>
          </div>

          <div className="flex flex-col items-center w-36 h-36 bg-gray-200 rounded-xl p-4">
            <CircularProgressbar
              value={ldr !== null ? ldr : 0}
              maxValue={1023}
              text={`${ldr !== null ? ldr : 0}`}
              styles={buildStyles({
                textColor: "#333",
                pathColor: "#FFD700",
                trailColor: "#ddd",
              })}
            />
            <p className="text-sm font-semibold mt-3">LDR</p>
          </div>
        </div>

        {/* Pump Switch */}
        <div className="flex items-center mt-8">
          <p className="text-lg font-bold mr-4 text-gray-700">Pompa Air</p>
          <div className={`flex items-center justify-between w-36 h-12 p-1 rounded-full cursor-pointer ${v1 === 1 ? "bg-green-500" : "bg-red-500"}`} onClick={updateV1}>
            <div className={`w-10 h-10 rounded-full transition-transform duration-300 ${v1 === 1 ? "transform translate-x-24 bg-white" : "bg-white"}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlynkDashboard;
