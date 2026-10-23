import { useState, useEffect } from "react";
import mqtt from "mqtt";
import {
  Droplets,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function MonitoringCard({ onMoistureChange }) {
  const [moisture, setMoisture] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Connecting");
  const [calibrating, setCalibrating] = useState(false);

  useEffect(() => {
    const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

    client.on("connect", () => {
      setConnectionStatus("Connected");
      client.subscribe("kebun/tanah/kelembaban");
    });

    client.on("message", (topic, message) => {
      if (topic === "kebun/tanah/kelembaban") {
        const value = parseInt(message.toString(), 10) || 0;
        setMoisture(value);

        if (onMoistureChange) {
          onMoistureChange(value);
        }
      }
    });

    client.on("error", (err) => {
      console.error("Connection error: ", err);
      setConnectionStatus("Error");
      client.end();
    });

    return () => {
      client.end();
    };
  }, [onMoistureChange]);

  const isDry = moisture < 40;
  const clampedMoisture = Math.min(Math.max(moisture, 0), 100);
  const arcTotalLength = 235.62;
  const arcDashOffset = arcTotalLength * (1 - clampedMoisture / 100);

  const handleCalibration = () => {
    setCalibrating(true);
    setTimeout(() => {
      setCalibrating(false);
    }, 1200);
  };

  return (
    <div className="w-full h-full min-h-[420px] bg-white dark:bg-slate-900/65 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-6 shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between">
      {/* 2.1 Header & Live Connection Status Pill */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Droplets size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Status Tanah
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Real-time Sensor Telemetry
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
            connectionStatus === "Connected"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
          }`}
        >
          <span className="relative flex h-2 w-2">
            {connectionStatus === "Connected" ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </>
            )}
          </span>
          {connectionStatus === "Connected" ? (
            <Wifi size={13} className="shrink-0" />
          ) : (
            <WifiOff size={13} className="shrink-0" />
          )}
          <span>{connectionStatus}</span>
        </div>
      </div>

      {/* 2.2 Semi-Circle Arc Gauge */}
      <div className="flex flex-col items-center justify-center my-auto py-2">
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
            <defs>
              <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="4"
                  floodColor={isDry ? "#ef4444" : "#10b981"}
                  floodOpacity="0.45"
                />
              </filter>
            </defs>

            {/* Background Arc Track */}
            <path
              d="M 25 95 A 75 75 0 0 1 175 95"
              fill="none"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Active Arc Gauge */}
            <path
              d="M 25 95 A 75 75 0 0 1 175 95"
              fill="none"
              stroke={isDry ? "#ef4444" : "#10b981"}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={arcTotalLength}
              strokeDashoffset={arcDashOffset}
              filter="url(#gauge-glow)"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Angka & Label di Tengah Busur */}
          <div className="absolute bottom-1 flex flex-col items-center pointer-events-none select-none">
            <div className="flex items-baseline justify-center">
              <span
                className={`text-4xl md:text-5xl font-black tabular-nums tracking-tight ${
                  isDry
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {moisture}
              </span>
              <span className="text-xl font-bold ml-1 opacity-70 text-slate-500 dark:text-slate-400">
                %
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              KELEMBABAN
            </span>
          </div>
        </div>

        {/* 2.3 Status Pill Kapsul Lebar */}
        <div
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all mt-4 ${
            isDry
              ? "bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/20 text-rose-600 dark:text-rose-400"
              : "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {isDry ? (
            <AlertTriangle size={17} className="shrink-0" />
          ) : (
            <CheckCircle2 size={17} className="shrink-0" />
          )}
          <span>{isDry ? "Tanah Kering! Perlu Disiram" : "Kondisi Tanah Optimal"}</span>
        </div>
      </div>

      {/* 2.4 Progress Bar & Range Ambang Batas */}
      <div className="w-full mt-2">
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
          <span>Ambang Kering (0%)</span>
          <span>Kondisi Ideal (60–80%)</span>
        </div>
        <div className="h-2.5 bg-slate-100 dark:bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/[0.05]">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isDry
                ? "bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
                : "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            }`}
            style={{ width: `${clampedMoisture}%` }}
          />
        </div>
      </div>

      {/* 2.5 Metadata & Kalibrasi Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">Deviasi Sensor: 0.0%</span>
        <button
          type="button"
          onClick={handleCalibration}
          className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:underline outline-none inline-flex items-center gap-1 transition-colors"
        >
          {calibrating ? (
            <span className="animate-pulse text-amber-500">Mengalibrasi...</span>
          ) : (
            <span>Kalibrasi Ulang →</span>
          )}
        </button>
      </div>
    </div>
  );
}

