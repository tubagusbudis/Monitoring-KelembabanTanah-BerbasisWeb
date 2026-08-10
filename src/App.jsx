import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import MonitoringCard from "./components/MonitoringCard";
import Chatbot from "./components/Chatbot";
import MoistureChart from "./components/MoistureChart"; // Import Chart barunya
import TextType from "./components/TextType";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  const [globalMoisture, setGlobalMoisture] = useState(0);

  // State baru untuk nyimpen riwayat data grafik
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Fungsi khusus untuk nangkep update dari MQTT dan ngisi data grafik
  const handleMoistureUpdate = (newValue) => {
    setGlobalMoisture(newValue); // Update angka di Chatbot

    setChartData((prevData) => {
      // Ambil waktu saat ini (contoh: "14:30:15")
      const now = new Date();
      const timeString = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const newDataPoint = { time: timeString, value: newValue };

      // Gabungkan data lama dengan data baru
      const updatedData = [...prevData, newDataPoint];

      // Biar grafiknya gak kepanjangan dan berat, kita batasi cuma nampilin 15 data terakhir
      if (updatedData.length > 15) {
        return updatedData.slice(updatedData.length - 15);
      }
      return updatedData;
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4 md:p-8 bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300 relative">
      {/* Tombol Dark Mode */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Header pakai TextType */}
      <div className="w-full max-w-5xl text-center mb-10 mt-16 md:mt-0">
        <TextType
          as="h1"
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 mb-2 pb-2"
          text={[
            "AgriSmart Monitor",
            "Sistem Cerdas Kebunmu",
            "Pantau Tanah Real-time",
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="●"
          deletingSpeed={50}
          variableSpeedEnabled={false}
          variableSpeedMin={60}
          variableSpeedMax={120}
          cursorBlinkDuration={0.5}
        />
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Dashboard Monitoring Tanah & AI Asisten
        </p>
      </div>

      {/* Layout Utama Grid */}
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Baris 1: Card Tanah & Chatbot AI */}
        <div className="flex flex-col md:flex-row w-full gap-6 items-stretch justify-center">
          <div className="w-full md:w-1/2 flex justify-center">
            {/* Pakai handleMoistureUpdate biar grafiknya ikut ke-update */}
            <MonitoringCard onMoistureChange={handleMoistureUpdate} />
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <Chatbot currentMoisture={globalMoisture} />
          </div>
        </div>

        {/* Baris 2: Grafik Historis full width di bawah */}
        <div className="w-full">
          <MoistureChart data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default App;
