import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import MonitoringCard from "./components/MonitoringCard";
import Chatbot from "./components/Chatbot";
import TextType from "./components/TextType";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // State baru untuk menyimpan data kelembaban secara global
  const [globalMoisture, setGlobalMoisture] = useState(0);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300 relative">
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="w-full max-w-4xl text-center mb-10 mt-16 md:mt-0">
        <TextType
          as="h1"
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 mb-2 pb-2"
          text={[
            "AgriSmart Monitor",
            "Sistem Cerdas Kebunmu",
            "Pantau Tanah Real-time",
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          deletingSpeed={50}
          showCursor={true}
          cursorCharacter=" "
        />
        <p className="text-gray-500 dark:text-gray-400">
          Dashboard Monitoring Tanah & AI Asisten
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-6 items-start justify-center">
        <div className="w-full md:w-1/2 flex justify-center">
          {/* Oper fungsi setGlobalMoisture ke dalam card */}
          <MonitoringCard onMoistureChange={setGlobalMoisture} />
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          {/* Oper data globalMoisture yang didapat dari card ke Chatbot */}
          <Chatbot currentMoisture={globalMoisture} />
        </div>
      </div>
    </div>
  );
}

export default App;
