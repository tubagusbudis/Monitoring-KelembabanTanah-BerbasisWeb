# 🌿 AgriSmart Monitor — Web-Based Soil Moisture Monitoring & AI Assistant

<div align="center">

![AgriSmart Banner](https://img.shields.io/badge/AgriSmart-v2.0-10b981?style=for-the-badge&logo=sprout&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=threedotjs&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-3.1_Flash_Lite-8e75ff?style=for-the-badge&logo=googlegemini&logoColor=white)
![MQTT](https://img.shields.io/badge/MQTT-HiveMQ_WebSocket-c00?style=for-the-badge&logo=mqtt&logoColor=white)

<p align="center">
  <b>Sistem Telemetri Monitoring Kelembaban Tanah Berbasis IoT Real-time, Dilengkapi Asisten Cerdas Gemini AI, Voice Synthesis (TTS), dan Visualisasi Kembar Digital 3D Interaktif.</b>
</p>

[Fitur Utama](#-fitur-utama) •
[Arsitektur Sistem](#-arsitektur-sistem) •
[Teknologi](#-teknologi--stack) •
[Panduan Instalasi](#-panduan-instalasi--penggunaan) •
[Konfigurasi IoT & MQTT](#-konfigurasi-iot--mqtt) •
[Struktur Proyek](#-struktur-proyek)

</div>

---

## 📖 Tentang Proyek

**AgriSmart Monitor** adalah platform dashboard telemetri agrikultur modern yang dirancang untuk memantau kondisi kelembaban tanah secara *real-time* melalui protokol IoT MQTT. 

Aplikasi ini tidak hanya menampilkan data metrik pasif, melainkan mengintegrasikan **Kecerdasan Buatan (Google Gemini 3.1 Flash Lite)** yang secara kontekstual menganalisis data kelembaban tanah saat ini untuk memberikan rekomendasi tindakan agronomis secara langsung. Didukung oleh **Visualisasi 3D Digital Twin (Three.js)** dan **Text-to-Speech (TTS)**, AgriSmart Monitor memberikan pengalaman pemantauan kebun pintar yang interaktif, estetis (*high-craft UI*), dan mudah dipahami.

---

## ✨ Fitur Utama

### 1. 📡 Telemetri Real-Time via MQTT
- Berkomunikasi melalui protokol **MQTT over WebSocket** (`broker.hivemq.com:8000`).
- Menerima pembaruan data secara instan dari topik sensor `kebun/tanah/kelembaban`.
- Dilengkapi indikator detak koneksi langsung (*pulsing heartbeat*) yang mendeteksi status sambungan jaringan (Tersambung / Terputus).

### 2. 🎯 Status Tanah & Semi-Circle Arc Gauge
- Gauge setengah lingkaran adaptif bergaya modern dengan warna transisi (*Rose Red* < 40% Kering, *Emerald Green* ≥ 40% Optimal).
- Kapsul status kondisi tanah cerdas (*Pill Alert*).
- Bar indikator ambang batas kelembaban ideal (60%–80%).
- Fitur simulasi kalibrasi sensor dan pembacaan deviasi secara langsung.

### 3. 🤖 AgriSmart AI Assistant (Google Gemini 3.1 Flash Lite)
- Integrasi SDK resmi `@google/generative-ai`.
- AI membaca nilai sensor kelembaban secara *live* saat pengguna mengajukan pertanyaan.
- Format respon cerdas, santai, dan terstruktur menggunakan *Markdown parser*.
- **Saran Cepat Otomatis (Dynamic Quick Tips)**: Rekomendasi volume penyiraman kontekstual tanpa perlu mengetik pertanyaan.

### 4. 🔊 Fitur Suara (Text-to-Speech / TTS)
- Mendukung sintesis suara berbahasa Indonesia (`id-ID`) via **Web Speech API**.
- Tombol **Putar Suara** pada setiap jawaban AI untuk aksesibilitas yang ramah pengguna.
- Pembersihan format markdown otomatis agar artikulasi suara terdengar alami.

### 5. 📈 Grafik Historis & 3 Kartu Analitik (Recharts)
- Grafik area interaktif (*smooth cubic curve*) dengan gradien warna zamrud.
- *Tooltip* kaca gelap yang presisi (*dark glassmorphic tooltip*).
- *Sliding window buffer* untuk 15 pembacaan telemetri terakhir.
- Pemilih rentang waktu (*Timeframe Pills*: 6 Jam, 24 Jam, 7 Hari).
- **3 Kartu Statistik Bawah**:
  - 🔺 **Tertinggi**: Nilai kelembaban puncak yang tercatat.
  - 📊 **Rata-rata**: Nilai rata-rata dinamis dari seluruh pembacaan.
  - ⚡ **Terkini**: Status kelembaban aktual beserta status kritis/optimal.

### 6. 🌿 Visualisasi 3D Digital Twin (Three.js / React Three Fiber)
- Representasi 3D model tanaman digital berdaun rimbun (*low-poly bonsai*).
- **Morfologi Adaptif**:
  - Kondisi Kering (< 40%): Daun layu kekuningan, tanah kering pecah-pecah, skala tanaman menciut.
  - Kondisi Optimal (≥ 40%): Daun hijau segar bertunas subur, warna tanah gembur dan lembab.
- Interaksi 360° menggunakan `OrbitControls` (rotasi, *pan*, dan *zoom*).

### 7. 🌓 Split-Screen App Shell & Mode Gelap/Terang
- Tata letak **Split-Screen Shell**: Sidebar *Deep Forest Emerald* (`#0A362B`) di kiri dan ruang kerja telemetri utama di kanan.
- Pilihan tema ganda: *Clean Minimalist Light Mode* dan *Specular Dark Mode* (`#061814` / `#0B0F17`) dengan *ambient glow*.
- Penyimpanan preferensi tema otomatis ke `localStorage`.

---

## 🏗️ Arsitektur Sistem

```text
  +--------------------------------+
  |    Hardware Sensor Lapangan    |
  |  (ESP32 / ESP8266 + Soil Node) |
  +---------------+----------------+
                  |
                  | MQTT Publish (kebun/tanah/kelembaban)
                  v
  +--------------------------------+
  |      HiveMQ Public Broker      |
  |    (ws://broker.hivemq.com)    |
  +---------------+----------------+
                  |
                  | WebSocket Subscribe
                  v
  +---------------------------------------------------------------+
  |                 AgriSmart Web Application                     |
  |                                                               |
  |  [Status Tanah]       [Grafik Historis]      [Visualisasi 3D] |
  |  Semi-Circle Arc      Recharts Area          Three.js Digital |
  |  Gauge & Range        Sliding Window         Twin Morfologi   |
  |                       3 Micro-Cards                           |
  |                                                               |
  |  [AgriSmart AI Assistant]                                     |
  |  Context-Aware Soil Analysis <---> Google Gemini 3.1 Flash    |
  |  Text-to-Speech (TTS id-ID)                                   |
  +---------------------------------------------------------------+
```

---

## 💻 Teknologi & Stack

| Kategori | Teknologi | Kegunaan |
|---|---|---|
| **Core Framework** | React 19, Vite 8 | UI library modern & build tool ultra-cepat |
| **Styling** | Tailwind CSS v4 | Utilitas styling modern, tema gelap/terang |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei` | Visualisasi kembar digital tanaman 3D |
| **Artificial Intelligence** | `@google/generative-ai` (`gemini-3.1-flash-lite`) | Asisten konsultasi agronomis cerdas |
| **Data Visualization** | `recharts` | Grafik area telemetri interaktif |
| **IoT Protocol** | `mqtt` (v5) | Konektivitas data real-time via WebSocket |
| **Audio Synthesis** | Web Speech API (`SpeechSynthesisUtterance`) | Fitur Text-to-Speech suara Indonesia |
| **Icons & Animasi** | `lucide-react`, `gsap` | Set ikon antarmuka & animasi halus |
| **Markdown** | `react-markdown` | Rendering output jawaban AI terformat rapi |

---

## 🚀 Panduan Instalasi & Penggunaan

### 1. Prasyarat Sistem
- **Node.js** versi 18.0.0 atau lebih baru
- **npm** atau **yarn**
- Kunci API Google Gemini (Dapatkan gratis di [Google AI Studio](https://aistudio.google.com/))

### 2. Kloning Repositori
```bash
git clone https://github.com/tubagusbudis/Monitoring-KelembabanTanah-BerbasisWeb.git
cd Monitoring-KelembabanTanah-BerbasisWeb
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Buka file `.env` dan masukkan API Key Gemini Anda:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser Anda dan akses tautan lokal yang ditampilkan (biasanya `http://localhost:5173/`).

### 6. Build untuk Produksi
```bash
npm run build
```
File hasil kompilasi siap disajikan di folder `dist/`.

---

## 🔌 Konfigurasi IoT & MQTT

Dashboard mendengarkan (*subscribe*) pesan dari broker MQTT berikut:

| Parameter | Pengaturan |
|---|---|
| **Broker URL** | `ws://broker.hivemq.com:8000/mqtt` |
| **Topic** | `kebun/tanah/kelembaban` |
| **Tipe Data Payload** | Nilai integer dalam format string teks (Contoh: `"68"`, `"35"`, `"80"`) |
| **Ambang Kering** | `< 40%` |
| **Ambang Optimal** | `60% - 80%` |

### Contoh Kode Pengirim Data (ESP32 / Arduino C++)
```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "WIFI_SSID_ANDA";
const char* password = "PASSWORD_WIFI";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883; // Port standar TCP (Dashboard menggunakan port 8000 WebSockets)

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    client.connect("ESP32_Soil_Node_01");
  }
  client.loop();

  // Membaca sensor kelembaban analog (misal: pin 34)
  int sensorValue = analogRead(34);
  int moisturePercent = map(sensorValue, 4095, 1500, 0, 100);
  moisturePercent = constrain(moisturePercent, 0, 100);

  // Publish ke MQTT Topic
  char payload[8];
  snprintf(payload, sizeof(payload), "%d", moisturePercent);
  client.publish("kebun/tanah/kelembaban", payload);

  delay(3000); // Kirim data setiap 3 detik
}
```

---

## 📁 Struktur Proyek

```text
Monitoring-KelembabanTanah-BerbasisWeb/
├── public/                 # Aset statis publik
├── src/
│   ├── assets/             # Asset gambar dan ikon
│   ├── components/         # Komponen Modular React
│   │   ├── Chatbot.jsx        # AgriSmart AI Chat & Voice TTS
│   │   ├── MoistureChart.jsx  # Recharts Area & 3 Micro-Cards
│   │   ├── MonitoringCard.jsx # Semi-Circle Gauge & Status Tanah
│   │   ├── Plant3D.jsx        # Three.js 3D Digital Twin Tanaman
│   │   ├── TextType.jsx       # Efek animasi teks ketik subjudul
│   │   └── TextType.css       # Styling kursor TextType
│   ├── App.css             # Penyesuaian style khusus
│   ├── App.jsx             # Shell utama, Sidebar, Layout Bento Grid
│   ├── index.css           # Konfigurasi Tailwind CSS v4 & theme tokens
│   └── main.jsx            # Entry point React
├── .env.example            # Contoh template konfigurasi environment
├── .gitignore              # Daftar pengabaian git
├── package.json            # Daftar pustaka & skrip proyek
├── vite.config.js          # Konfigurasi Vite
└── README.md               # Dokumentasi utama proyek
```

---

## 🎨 Sistem Desain & Konsep UI

Dashboard mengusung estetika *High-Craft Telemetry UI* yang elegan dengan perpaduan warna alami, tipografi modern, dan tata letak responsif:

- **Primary Forest Emerald:** `#0A362B` (Sidebar & Branding)
- **Ambient Dark Canvas:** `#061814` / `#0B0F17` (Dark Mode Surface)
- **Telemetry Card Surface:** `#FFFFFF` (Light) & `rgba(15, 23, 42, 0.65)` (Dark Glass)
- **Status Alert Tones:**
  - Optimal / Subur: `#10B981` (Emerald)
  - Kering / Butuh Air: `#EF4444` (Rose Red) / `#F59E0B` (Amber)

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan riset, edukasi, dan implementasi agrikultur presisi berbasis IoT.  
Dilisensikan di bawah [MIT License](LICENSE).

---

<div align="center">
  Dibuat dengan ❤️ untuk kemajuan Pertanian Cerdas (Smart Agriculture) Indonesia 🇮🇩
</div>
