import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const BlynkToggleButton = () => {
  const [v1, setV1] = useState(0); // Awal nilai untuk tombol
  const [temperature, setTemperature] = useState(null); // Suhu (V5)
  const [humidity, setHumidity] = useState(null); // Kelembaban (V6)

  // Fungsi untuk mengupdate nilai v1 (toggle on/off)
  const updateV1 = async () => {
    const newValue = v1 === 0 ? 1 : 0; // Toggle antara 0 dan 1
    try {
      await axios.get(`https://sgp1.blynk.cloud/external/api/update?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v1=${newValue}`);
      setV1(newValue); // Update nilai lokal setelah sukses
    } catch (error) {
      console.error("Error updating v1:", error);
    }
  };

  // Fungsi untuk mengambil suhu dan kelembaban dari Blynk
  const fetchSensorData = async () => {
    try {
      const tempResponse = await axios.get("https://sgp1.blynk.cloud/external/api/get?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v5");
      const humResponse = await axios.get("https://sgp1.blynk.cloud/external/api/get?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v6");
      setTemperature(tempResponse.data); // Set suhu (V5)
      setHumidity(humResponse.data); // Set kelembaban (V6)
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  // Mengambil data sensor secara berkala (misalnya setiap 5 detik)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorData();
    }, 5000); // Setiap 5 detik
    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    textAlign: "center",
  };

  const gaugeContainerStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
    marginTop: "20px",
  };

  const cardStyle = {
    width: "150px",
    height: "150px",
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={updateV1}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#fff",
          backgroundColor: v1 === 0 ? "#28a745" : "#dc3545",
          border: "none",
          borderRadius: "30px",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          transition: "background-color 0.3s ease, transform 0.2s",
          marginBottom: "20px",
        }}
      >
        {v1 === 0 ? "Turn On (1)" : "Turn Off (0)"}
      </button>

      <div style={gaugeContainerStyle}>
        <div style={cardStyle}>
          <CircularProgressbar
            value={temperature !== null ? temperature : 0}
            maxValue={50} // Asumsikan suhu maksimal 50°C
            text={`${temperature !== null ? temperature : 0}°C`}
            styles={buildStyles({
              textColor: "#333",
              pathColor: "#f03e3e",
              trailColor: "#eee",
            })}
          />
          <p style={{ marginTop: "10px", fontSize: "16px", fontWeight: "600", color: "#333" }}>Temperature</p>
        </div>

        <div style={cardStyle}>
          <CircularProgressbar
            value={humidity !== null ? humidity : 0}
            maxValue={100} // Asumsikan kelembaban maksimal 100%
            text={`${humidity !== null ? humidity : 0}%`}
            styles={buildStyles({
              textColor: "#333",
              pathColor: "#3498db",
              trailColor: "#eee",
            })}
          />
          <p style={{ marginTop: "10px", fontSize: "16px", fontWeight: "600", color: "#333" }}>Humidity</p>
        </div>
      </div>
    </div>
  );
};

export default BlynkToggleButton;
