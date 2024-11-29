import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const KalkulasiPupuk = () => {
  const [sensorData, setSensorData] = useState(0);
  const [plantAge, setPlantAge] = useState("");
  const [landArea, setLandArea] = useState("");
  const [isSoilPreparation, setIsSoilPreparation] = useState(false);
  const [fertilizerOptions, setFertilizerOptions] = useState([]);
  const [selectedFertilizer, setSelectedFertilizer] = useState("");
  const [calculatedWeight, setCalculatedWeight] = useState(null);

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

  const fertilizerPhases = {
    soilPreparation: [
      { name: "NPK GOLD DGW 16-10-18", dose: 200 },
      { name: "HX-DAP", dose: 100 },
    ],
    "0-15": [
      { name: "NPK COMPACTION DGW 15-15-15+TE", dose: 200 },
      { name: "HX-AS", dose: 100 },
    ],
    "20-45": [
      { name: "NPK BOOSTER DGW 12-6-22-3+TE", dose: 200 },
      { name: "HX-MROPH", dose: 50 },
      { name: "KNO3 Prill", dose: 25 },
    ],
  };

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await axios.get("https://sgp1.blynk.cloud/external/api/get?token=ToiFf4bF5XdKm2MwLF6W1S_ONApla_dn&v0");
        setSensorData(response.data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSoilPreparationChange = (e) => {
    const checked = e.target.checked;
    setIsSoilPreparation(checked);
    if (checked) {
      setPlantAge("soilPreparation");
      setFertilizerOptions(fertilizerPhases.soilPreparation);
      setSelectedFertilizer("");
    } else {
      setPlantAge("");
      setFertilizerOptions([]);
    }
  };

  const handlePlantAgeChange = (e) => {
    setPlantAge(e.target.value);
    setIsSoilPreparation(false); // Reset if manual input
    let options = [];
    if (e.target.value >= 0 && e.target.value <= 15) {
      options = fertilizerPhases["0-15"];
    } else if (e.target.value >= 20 && e.target.value <= 45) {
      options = fertilizerPhases["20-45"];
    }
    setFertilizerOptions(options);
    setSelectedFertilizer("");
  };

  const handleCalculate = () => {
    if (!selectedFertilizer || !landArea) {
      alert("Please select fertilizer and input land area!");
      return;
    }

    const selected = fertilizerOptions.find((option) => option.name === selectedFertilizer);
    const weight = (selected.dose * landArea) / 10000; // Convert Ha to m²
    setCalculatedWeight(weight);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Kalkulasi Dosis Pupuk</h1>

      {/* Sensor Gauge */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center w-36 h-36 bg-gray-200 rounded-xl p-4">
          <CircularProgressbar
            value={sensorData !== null ? sensorData : 0}
            maxValue={100}
            text={`${sensorData !== null ? sensorData : 0} Kg`}
            styles={buildStyles({
              textColor: "#333",
              pathColor: "#1E90FF",
              trailColor: "#ddd",
            })}
          />
          <p className="text-sm font-semibold mt-3">Berat Sensor</p>
        </div>
      </div>

      {/* User Inputs */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Umur Tanaman (HST)</label>
        <label className="flex items-center space-x-3 mt- mb-2">
          <input type="checkbox" checked={isSoilPreparation} onChange={handleSoilPreparationChange} className="form-checkbox h-4 w-4 text-blue-500" />
          <span className="text-sm">Masa Pengolahan Tanah</span>
        </label>
        <input type="text" placeholder="Masukkan umur (e.g., 0, 20)" value={plantAge} onChange={handlePlantAgeChange} className="border p-2 rounded w-full" disabled={isSoilPreparation} />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">Luas Lahan (m²)</label>
        <input type="number" placeholder="Masukkan luas lahan (m²)" value={landArea} onChange={(e) => setLandArea(e.target.value)} className="border p-2 rounded w-full" />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">Tipe Pupuk</label>
        <select value={selectedFertilizer} onChange={(e) => setSelectedFertilizer(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Pilih Pupuk</option>
          {fertilizerOptions.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleCalculate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Hitung Dosis Pupuk
      </button>

      {calculatedWeight !== null && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">Hasil Perhitungan:</h2>
          <p>
            Dosis yang harus ditimbang: <strong>{calculatedWeight.toFixed(2)} Kg</strong>
          </p>
          {/* Update text indicating if the fertilizer amount is correct */}
          {sensorData && calculatedWeight !== null && sensorData >= calculatedWeight ? (
            <p className="text-green-500 mt-4">Berat pupuk sudah sesuai dengan kalkulasi!</p>
          ) : (
            <p className="text-red-500 mt-4">Berat pupuk belum sesuai dengan kalkulasi!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default KalkulasiPupuk;
