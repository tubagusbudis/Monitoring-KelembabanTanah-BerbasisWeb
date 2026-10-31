# 🌿 AgriSmart Monitor — Design System v2.0 (`DESIGN.md`)
> **Architecture:** Hybrid Enterprise Telemetry Shell + Atmospheric High-Craft UI  
> **Reference Sources:** `screen.jpg` (Layout & Micro-Metrics) + `Screenshot 2026-10-15 205856.png` (Dark Surface & Specular Glow)

---

## 1. Spatial Architecture & App Shell
Aplikasi menggunakan struktur **Split-Screen App Shell** yang memisahkan navigasi sistem dari kanvas telemetri utama:

```text
+--------------------+-------------------------------------------------------------------+
|  SIDEBAR SHELL     |  MAIN TELEMETRY WORKSPACE (Rounded Left Container)                |
|  (#0A362B Forest)  |  +-------------------------------------------------------------+  |
|                    |  | AgriSmart Monitor [● Live Node #01]       [↻ Refresh Sensor]|  |
|  [🌱] AgriSmart    |  | Dashboard Monitoring Kelembaban Tanah & AI Asisten Pintar   |  |
|                    |  +-----------------------------+-------------------------------+  |
|  NAVIGATION        |  | 1. STATUS TANAH             | 2. AGRISMART AI               |  |
|  [■] Dashboard     |  | - Semi-Circle Arc Gauge     | - Header + "Online Asisten"   |  |
|  [📈] Analytics    |  | - Pill Alert Status         | - Avatar + Markdown Bubble    |  |
|  [⚡] Riwayat      |  | - Range Bar (0% to 60-80%)  | - [🔊 Putar Suara]            |  |
|                    |  | - Deviasi 0.0% | Kalibrasi  | - [💡 Saran Cepat Kontekstual]|  |
|                    |  +-----------------------------+---------------+---------------+  |
|                    |  | 3. GRAFIK HISTORIS KELEMBABAN               | 4. VISUAL 3D  |  |
|                    |  | - Header + Time Pills [6J | 24J | 7H]       | - Header+Pill |  |
|  +--------------+  |  | - Recharts AreaChart                        | - 3D Canvas   |  |
|  | 🌙 Mode Gelap|  |  | - [Tertinggi]  [Rata-rata]  [Terkini/Kritis]| - Status Bar  |  |
|  +--------------+  |  +---------------------------------------------+---------------+  |
|                    |  | 🛡️ AgriSmart Telemetry Sensor Hub     Sinkronisasi: Baru saja|  |
+--------------------+-------------------------------------------------------------------+