import { useState, useEffect } from "react";
import mqtt from "mqtt";
import { Droplet, Wifi, WifiOff } from "lucide-react";

export default function MonitoringCard({ onMoistureChange }) {
  const [moisture, setMoisture] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Connecting");

  useEffect(() => {
    const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

    client.on("connect", () => {
      setConnectionStatus("Connected");
      client.subscribe("kebun/tanah/kelembaban");
    });

    client.on("message", (topic, message) => {
      if (topic === "kebun/tanah/kelembaban") {
        const value = parseInt(message.toString());
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
  }, []);

  const isDry = moisture < 40;
  const statusColor = isDry ? "text-red-500" : "text-emerald-500";

  // Penyesuaian warna background bulat biar masuk di dark mode
  const bgColor = isDry
    ? "bg-red-100 dark:bg-red-500/20"
    : "bg-emerald-100 dark:bg-emerald-500/20";

  const progressColor = isDry ? "bg-red-500" : "bg-emerald-500";

  return (
    // Tambahin class dark:bg-gray-800 dan dark:border-gray-700 di div pembungkus utama
    <div className="w-full max-w-full p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-2xl transition-colors duration-300">
      {/* Header & Status Koneksi */}
      <div className="flex items-center justify-between mb-8">
        {/* Tambahin dark:text-white */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Status Tanah
        </h2>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            connectionStatus === "Connected"
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
          }`}
        >
          {connectionStatus === "Connected" ? (
            <Wifi size={14} />
          ) : (
            <WifiOff size={14} />
          )}
          {connectionStatus}
        </div>
      </div>

      {/* Main Display Kelembaban */}
      <div className="flex flex-col items-center justify-center">
        <div
          className={`flex items-center justify-center w-32 h-32 mb-4 rounded-full ${bgColor} transition-colors duration-300`}
        >
          <div className="text-center">
            <span className={`text-5xl font-black ${statusColor}`}>
              {moisture}
            </span>
            <span className={`text-xl font-bold ${statusColor}`}>%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Droplet className={statusColor} size={24} fill="currentColor" />
          {/* Tambahin dark:text-gray-200 */}
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {isDry ? "Tanah Kering! Perlu Disiram" : "Kondisi Tanah Optimal"}
          </p>
        </div>
      </div>

      {/* Progress Bar Estetik */}
      {/* Tambahin dark:bg-gray-700 */}
      <div className="w-full h-3 overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-full transition-colors duration-300">
        <div
          className={`h-full transition-all duration-500 ease-in-out ${progressColor}`}
          style={{ width: `${moisture}%` }}
        />
      </div>
    </div>
  );
}
