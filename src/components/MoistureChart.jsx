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

// 1. PINDAHKAN CustomTooltip ke luar komponen utama (Best practice React)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl">
        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">
          {label}
        </p>
        <p className="text-emerald-500 dark:text-emerald-400 font-bold text-sm">
          Kelembaban: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function MoistureChart({ data }) {
  return (
    <div className="w-full h-[350px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-2xl p-5 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-emerald-500" size={20} />
        <h3 className="font-bold text-gray-800 dark:text-white">
          Grafik Historis Kelembaban
        </h3>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#374151"
              opacity={0.2}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />

            {/* 2. Panggil CustomTooltip tanpa tanda kurung kurawal/tag HTML */}
            <Tooltip content={CustomTooltip} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMoisture)"
              isAnimationActive={true}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
