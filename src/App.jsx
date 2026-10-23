import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Sprout,
  LayoutDashboard,
  LineChart,
  Activity,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import MonitoringCard from "./components/MonitoringCard";
import Chatbot from "./components/Chatbot";
import MoistureChart from "./components/MoistureChart";
import Plant3D from "./components/Plant3D";
import TextType from "./components/TextType";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  const [globalMoisture, setGlobalMoisture] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleMoistureUpdate = (newValue) => {
    setGlobalMoisture(newValue);

    setChartData((prevData) => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const newDataPoint = { time: timeString, value: newValue };
      const updatedData = [...prevData, newDataPoint];

      if (updatedData.length > 15) {
        return updatedData.slice(updatedData.length - 15);
      }
      return updatedData;
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0A362B] dark:bg-[#061814] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* 1.2 Sidebar Kiri */}
      <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between p-5 text-white select-none">
        {/* Atas Sidebar: Logo & Navigasi */}
        <div>
          {/* Logo AgriSmart */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Sprout size={22} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>AgriSmart</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/60 font-medium">
                IoT Agriculture Monitor
              </p>
            </div>
          </div>

          {/* Label Navigasi */}
          <div className="text-[11px] font-bold tracking-wider text-emerald-300/60 uppercase mt-8 mb-3 px-2">
            NAVIGATION
          </div>

          {/* Menu Navigasi */}
          <nav className="flex flex-col gap-1.5">
            <button
              type="button"
              className="w-full bg-white/15 text-white font-semibold rounded-xl px-3.5 py-2.5 flex items-center gap-3 shadow-sm text-sm text-left transition-all"
            >
              <LayoutDashboard size={18} className="text-emerald-400" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className="w-full text-emerald-100/70 hover:text-white hover:bg-white/5 rounded-xl px-3.5 py-2.5 flex items-center gap-3 cursor-pointer text-sm text-left transition-colors"
            >
              <LineChart size={18} />
              <span>Analytics</span>
            </button>

            <button
              type="button"
              className="w-full text-emerald-100/70 hover:text-white hover:bg-white/5 rounded-xl px-3.5 py-2.5 flex items-center gap-3 cursor-pointer text-sm text-left transition-colors"
            >
              <Activity size={18} />
              <span>Riwayat Sensor</span>
            </button>
          </nav>
        </div>

        {/* Bawah Sidebar: Mode Gelap Switch Card */}
        <div
          onClick={toggleDarkMode}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleDarkMode();
            }
          }}
          className="bg-black/25 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-black/35 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white group-hover:scale-105 transition-transform">
              {isDarkMode ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-emerald-200" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-white">Mode Gelap</div>
              <div className="text-[10px] text-emerald-200/60">Tema Malam</div>
            </div>
          </div>

          <div
            className={`w-11 h-6 rounded-full relative p-0.5 transition-colors duration-200 ${
              isDarkMode ? "bg-emerald-500" : "bg-white/20"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                isDarkMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </aside>

      {/* 1.3 Main Workspace Container (Kanan) */}
      <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0B0F17] lg:rounded-l-[2rem] p-5 md:p-8 overflow-y-auto relative shadow-2xl flex flex-col justify-between min-h-screen">
        {/* Layer Radial Ambient Glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]"
          aria-hidden="true"
        />

        {/* Top Header Bar */}
        <header className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                AgriSmart Monitor
              </h1>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Node #01
              </span>
            </div>
            <div className="mt-1">
              <TextType
                as="p"
                className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium"
                text={[
                  "Dashboard Monitoring Kelembaban Tanah & AI Asisten Pintar",
                  "Sistem Cerdas Kebunmu - Pantau Real-time",
                  "Telemetri IoT Berbasis Enclosure Node Aktif",
                ]}
                typingSpeed={50}
                pauseDuration={2000}
                showCursor={true}
                cursorCharacter="|"
                deletingSpeed={30}
                variableSpeedEnabled={false}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="Refresh sensor data"
              className="px-3.5 py-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-sm hover:shadow flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <RefreshCw
                size={14}
                className={`text-emerald-500 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh Sensor</span>
            </button>

            {/* Mobile dark mode toggle button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="lg:hidden p-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-xl shadow-sm cursor-pointer"
            >
              {isDarkMode ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-slate-700" />
              )}
            </button>
          </div>
        </header>

        {/* Bento Grid Area */}
        <div className="relative z-10 w-full flex-1 flex flex-col gap-5">
          {/* Baris 1: MonitoringCard (50%) & Chatbot (50%) */}
          <div className="flex flex-col md:flex-row w-full gap-5 items-stretch justify-center">
            <div className="w-full md:w-1/2 flex justify-center">
              <MonitoringCard onMoistureChange={handleMoistureUpdate} />
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <Chatbot currentMoisture={globalMoisture} />
            </div>
          </div>

          {/* Baris 2: MoistureChart (2/3) & Plant3D (1/3) */}
          <div className="flex flex-col md:flex-row w-full gap-5 items-stretch justify-center mb-4">
            <div className="w-full md:w-2/3 flex justify-center">
              <MoistureChart data={chartData} />
            </div>

            <div className="w-full md:w-1/3 flex justify-center">
              <Plant3D moisture={globalMoisture} />
            </div>
          </div>
        </div>

        {/* Bottom Telemetry Footer */}
        <footer className="relative z-10 mt-6 pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span className="font-medium">
              AgriSmart Telemetry Sensor Hub — Enclosure Node Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Sinkronisasi Terakhir: Baru saja</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;

