import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Activity } from "lucide-react";

// 4.2 CustomTooltip kaca gelap
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-3">
        <p className="text-slate-400 text-xs font-semibold mb-1">{label}</p>
        <p className="text-emerald-400 font-bold text-sm tabular-nums">
          Kelembaban: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function MoistureChart({ data }) {
  const [activeTimeframe, setActiveTimeframe] = useState("24 Jam");

  // Perhitungan statistik otomatis (derived state) dari data
  const values =
    Array.isArray(data) && data.length > 0
      ? data.map((d) => (typeof d.value === "number" ? d.value : 0))
      : [];

  const maxVal = values.length > 0 ? Math.max(...values) : 0;
  const avgVal =
    values.length > 0
      ? (values.reduce((acc, curr) => acc + curr, 0) / values.length).toFixed(1)
      : "0.0";
  const currentVal = values.length > 0 ? values[values.length - 1] : 0;
  const isCurrentDry = currentVal < 40;

  return (
    // 4.1 Card Wrapper & Header Grafik
    <div className="w-full h-full min-h-[420px] bg-white dark:bg-slate-900/65 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500/30 shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between">
      {/* Header Bar: Kiri Judul, Kanan Timeframe Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-100 tracking-tight">
              Grafik Historis Kelembaban
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Tren Telemetri Real-time Node
            </p>
          </div>
        </div>

        {/* 4.1 Segmented Timeframe Pills */}
        <div className="bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold border border-slate-200/60 dark:border-white/5 self-start sm:self-auto">
          {["6 Jam", "24 Jam", "7 Hari"].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setActiveTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                activeTimeframe === tf
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4.2 Area Grafik Recharts */}
      <div className="w-full h-[210px] my-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#94a3b8"
              opacity={0.15}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickMargin={8}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip content={CustomTooltip} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMoisture)"
              isAnimationActive={true}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 4.3 3 Kartu Ringkasan Statistik (Grid 3 Kolom) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
        {/* Kartu 1: Tertinggi */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-white/5 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
            Tertinggi
          </div>
          <div className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-slate-100 tabular-nums">
            {maxVal}%
          </div>
        </div>

        {/* Kartu 2: Rata-rata */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-white/5 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
            Rata-rata
          </div>
          <div className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-slate-100 tabular-nums">
            {avgVal}%
          </div>
        </div>

        {/* Kartu 3: Terkini */}
        <div
          className={`border rounded-xl p-2.5 sm:p-3 text-center transition-colors ${
            isCurrentDry
              ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          <div className="text-[10px] sm:text-[11px] font-bold opacity-80 uppercase tracking-wider mb-0.5">
            Terkini
          </div>
          <div className="font-extrabold text-sm sm:text-base tabular-nums flex items-center justify-center gap-1 flex-wrap">
            <span>{currentVal}%</span>
            <span className="text-[11px] font-semibold">
              ({isCurrentDry ? "Kritis" : "Optimal"})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

