import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaBell } from "react-icons/fa"; // Import an icon library for the bell icon
import { useLocation, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BlynkDashboard = ({ username }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const currentUsername = location.state.username;

  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [ldr, setLdr] = useState([]);
  const [v1, setV1] = useState(0);
  const [temperatureBlynk, setTemperatureBlynk] = useState(null);
  const [humidityBlynk, setHumidityBlynk] = useState(null);
  const [ldrBlynk, setLdrBlynk] = useState(null);

  const [userProfile, setUserProfile] = useState({
    username: "",
    profileImage: "",
  });

  // Fetch user profile data from API
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`https://fimbackend.vercel.app/user/getUser/${currentUsername}`);
      setUserProfile({
        username: response.data.username,
        profileImage: response.data.img_url,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (currentUsername) {
      fetchUserProfile();
    }
  }, [currentUsername]);

  const updateV1 = async () => {
    const newValue = v1 === 0 ? 1 : 0;
    try {
      await axios.get(`https://sgp1.blynk.cloud/external/api/update?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v1=${newValue}`);
      setV1(newValue);

      // Send notification when Relay is turned on or off
      if (newValue === 1) {
        sendNotification("Pompa Air Dinyalakan", "Relay Pompa Air");
      } else {
        sendNotification("Pompa Air Dimatikan", "Relay Pompa Air");
      }
    } catch (error) {
      console.error("Error updating v1:", error);
    }
  };

  // Function to send notification
  const sendNotification = async (isi, from) => {
    try {
      await axios.post("https://fimbackend.vercel.app/general/addNotif", {
        isi: isi,
        from: from,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const fetchSensorData = async () => {
    try {
      const tempResponse = await axios.get("https://fimbackend.vercel.app/aktuator/temperature");
      const humResponse = await axios.get("https://fimbackend.vercel.app/aktuator/humidity");
      const ldrResponse = await axios.get("https://fimbackend.vercel.app/aktuator/ldr");

      setTemperature(tempResponse.data.slice(-5)); // Get the last 10 data points
      setHumidity(humResponse.data.slice(-5));
      setLdr(ldrResponse.data.slice(-5));
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  const fetchSensorDataBlynk = async () => {
    try {
      const tempResponseBlynk = await axios.get("https://sgp1.blynk.cloud/external/api/get?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v5");
      const humResponseBlynk = await axios.get("https://sgp1.blynk.cloud/external/api/get?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v6");
      const ldrResponseBlynk = await axios.get("https://sgp1.blynk.cloud/external/api/get?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v7");
      
      setTemperatureBlynk(tempResponseBlynk.data);
      setHumidityBlynk(humResponseBlynk.data);
      setLdrBlynk(ldrResponseBlynk.data);

      await axios.post("https://fimbackend.vercel.app/aktuator/temperature", {
        value : temperatureBlynk
      });
  
      await axios.post("https://fimbackend.vercel.app/aktuator/humidity", {
        value : humidityBlynk
      });
  
      await axios.post("https://fimbackend.vercel.app/aktuator/ldr", {
        value : ldrBlynk
      });

      if (tempResponseBlynk.data < 10) {
        sendNotification("Suhu terlalu dingin", "Sensor Suhu");
      } else if (tempResponseBlynk.data > 40) {
        sendNotification("Suhu terlalu panas", "Sensor Suhu");
      }
  
      if (humResponseBlynk.data < 30) {
        sendNotification("Tanaman kekurangan air", "Sensor Humidity");
        try{
           await axios.get(`https://sgp1.blynk.cloud/external/api/update?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v1=1`);
           sendNotification("Pompa Air Dinyalakan", "Relay Pompa Air");
        } catch (error) {
           console.error("Error :", error);
        }
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    fetchSensorData();
    fetchSensorDataBlynk();

    const interval = setInterval(() => {
      fetchSensorData();
      fetchSensorDataBlynk();
    }, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const generateChartData = (data, label, color) => ({
    labels: data.map((_, index) => `Data ${index + 1}`), // Generate labels dynamically
    datasets: [
      {
        label,
        data: data.map((item) => item.value),
        borderColor: color,
        backgroundColor: `${color}50`,
        tension: 0.4,
      },
    ],
  });

  const getLatestValue = (data) => (data.length > 0 ? data[data.length - 1].value : 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="flex flex-col items-center p-10 bg-gray-100 rounded-2xl w-full max-w-6xl shadow-lg mx-10">
        {/* Header with Title and Buttons */}
        <div className="flex justify-between items-center w-full mb-5">
          <div className="flex space-x-4">
            <button
              onClick={() =>
                navigate("/pupuk", {
                  state: {
                    username: currentUsername, // Mengirim username
                  },
                })
              }
              className="bg-black text-xs text-white px-2 py-2 rounded-xl hover:bg-slate-600"
            >
              Pupuk
            </button>
            <button
              onClick={() =>
                navigate("/automation", {
                  state: {
                    username: currentUsername, // Mengirim username
                  },
                })
              }
              className="bg-black text-xs text-white px-3 rounded-xl hover:bg-slate-600"
            >
              Automisasi
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() =>
                navigate("/notifikasi", {
                  state: {
                    username: currentUsername, // Mengirim username
                  },
                })
              }
              className="p-2 bg-yellow-400 text-white rounded-full hover:bg-slate-600"
            >
              <FaBell />
            </button>
            <div className="flex items-center space-x-4">
              <img src={userProfile.profileImage} alt="Profile" className="w-10 h-10 rounded-full" />
              <span className="text-sm font-semibold">{userProfile.username}</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-700 mb-10">Dashboard</h1>
        {/* Gauges */}
        <div className="flex justify-around w-full mb-10 space-x-6">
          <div className="flex flex-col items-center w-36 h-36 bg-gray-200 rounded-xl p-4">
            <CircularProgressbar
              value={temperatureBlynk !== null ? temperatureBlynk : 0}
              maxValue={50}
              text={`${temperatureBlynk !== null ? temperatureBlynk : 0}°C`}
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
              value={humidityBlynk !== null ? humidityBlynk : 0}
              maxValue={100}
              text={`${humidityBlynk !== null ? humidityBlynk : 0}%`}
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
              value={ldrBlynk !== null ? ldrBlynk : 0}
              maxValue={100}
              text={`${ldrBlynk !== null ? ldrBlynk : 0}%`}
              styles={buildStyles({
                textColor: "#333",
                pathColor: "#32CD32",
                trailColor: "#ddd",
              })}
            />
            <p className="text-sm font-semibold mt-3">LDR</p>
          </div>
        </div>

        <div className="w-full mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sensor Data</h2>
          {/* Grid Layout */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Temperature Chart */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-center">Suhu</h3>
              <div className="w-full h-64">
                <Line
                  data={generateChartData(temperature, "Suhu (°C)", "#FF4500")}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        min: 0,
                        max: 50,
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Humidity Chart */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-center">Kelembaban</h3>
              <div className="w-full h-64">
                <Line
                  data={generateChartData(humidity, "Kelembaban (%)", "#1E90FF")}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        min: 0,
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* LDR Chart */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-center">LDR</h3>
              <div className="w-full h-64">
                <Line
                  data={generateChartData(ldr, "LDR (Lux)", "#32CD32")}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        min: 0,
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Relay Button */}
        <div className="w-full flex justify-center mt-6">
          <button onClick={updateV1} className={`px-6 py-2 text-white rounded-xl ${v1 === 0 ? "bg-gray-500" : "bg-green-500"}`}>
            {v1 === 0 ? "Matikan Pompa" : "Nyalakan Pompa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlynkDashboard;
