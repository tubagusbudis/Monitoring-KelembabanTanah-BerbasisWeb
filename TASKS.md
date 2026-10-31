```markdown
# 📋 AgriSmart Monitor — Agent Implementation Tasks v2.0 (`TASKS.md`)

> **Instruksi untuk AI Agent:**  
> Kerjakan seluruh daftar tugas di bawah ini secara berurutan (Tahap 1 s/d Tahap 6) untuk mengimplementasikan tata letak **Sidebar App Shell & Micro-Metrics** sesuai gambar referensi `screen.jpg` dan spesifikasi `DESIGN.md` v2.0, sembari mempertahankan efek *High-Craft Dark UI* dari desain sebelumnya.  
> **PANTANGAN MUTLAK:** Jangan merusak koneksi MQTT, fungsi Gemini API (`gemini-3.1-flash-lite`), fungsi `speakText`, maupun komponen 3D Three.js yang sudah ada.

---

## Tahap 1: Pembuatan App Shell, Sidebar, dan Workspace (`src/App.jsx`)
- [x] **1.1. Struktur Split-Screen Shell:**
  - Ubah wrapper terluar di `App.jsx` menjadi kontainer flex horizontal penuh (`min-h-screen w-full flex bg-[#0A362B] dark:bg-[#061814] text-slate-900 dark:text-slate-100 transition-colors duration-300`).
- [x] **1.2. Komponen Sidebar Kiri:**
  - Buat `<aside>` di sisi kiri (`w-64 shrink-0 hidden lg:flex flex-col justify-between p-5 text-white select-none`).
  - **Bagian Atas Sidebar:** Buat logo AgriSmart (kotak ikon `<Sprout />` berwarna hijau zamrud cerah + teks tebal `AgriSmart`), diikuti label seksi `NAVIGATION` (`text-[11px] font-bold tracking-wider text-emerald-300/60 uppercase mt-8 mb-3`).
  - **Menu Navigasi:** Buat 3 item menu dengan ikon `lucide-react`:
    1. `Dashboard` (`<LayoutDashboard size={18} />`) — beri *style* aktif (`bg-white/15 text-white font-semibold rounded-xl px-3.5 py-2.5 flex items-center gap-3`).
    2. `Analytics` (`<LineChart size={18} />`) — *style* pasif (`text-emerald-100/70 hover:text-white hover:bg-white/5 rounded-xl px-3.5 py-2.5 flex items-center gap-3 cursor-pointer`).
    3. `Riwayat Sensor` (`<Activity size={18} />`) — *style* pasif.
  - **Bagian Bawah Sidebar (Theme Toggle Card):** Pindahkan tombol *Dark Mode* dari pojok kanan atas layar ke dalam sebuah kartu di bagian bawah *sidebar* (`bg-black/25 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer` saat diklik memanggil `toggleDarkMode`). Tampilkan ikon bulan/matahari, teks `Mode Gelap` (subteks `Tema Malam`), dan visual *toggle switch* hijau (`w-11 h-6 bg-emerald-500 rounded-full relative`).
- [x] **1.3. Main Workspace Container (Kanan):**
  - Buat `<main>` untuk area konten utama (`flex-1 bg-[#F4F6F8] dark:bg-[#0B0F17] lg:rounded-l-[2rem] p-5 md:p-8 overflow-y-auto relative shadow-2xl flex flex-col justify-between`). Pertahankan *layer radial ambient glow* halus untuk mode gelap.
  - **Top Header Bar:** Buat header rata kiri-kanan (`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6`). Di sisi kiri: tampilkan judul `AgriSmart Monitor` bersama *badge* `● Live Node #01` (`bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold`), serta komponen `<TextType />` untuk teks subjudul/animasi. Di sisi kanan: tambahkan tombol `<RefreshCw size={14} /> Refresh Sensor` dan tombol *toggle dark mode* khusus tampilan *mobile* (`lg:hidden`).
  - **Bottom Telemetry Footer:** Di bawah Bento Grid utama, tambahkan *footer bar* (`mt-8 pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2`) berisi `<ShieldCheck size={15} className="text-emerald-500" /> AgriSmart Telemetry Sensor Hub — Enclosure Node Active` di kiri, dan `Sinkronisasi Terakhir: Baru saja` di kanan.

---

## Tahap 2: Upgrade Panel Status Tanah dengan Semi-Circle Gauge (`src/components/MonitoringCard.jsx`)
- [x] **2.1. Dual-Theme Card Surface:** Gunakan class permukaan yang tampak bersih di mode terang dan *high-craft glass* di mode gelap (`bg-white dark:bg-slate-900/65 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-6 shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between w-full`).
- [x] **2.2. Semi-Circle Arc Gauge:**
  - Ubah lingkaran penuh menjadi **SVG Busur Setengah Lingkaran (Semi-Circle Gauge)** di tengah kartu (`viewBox="0 0 200 110"`).
  - Buat *track* busur latar belakang (`stroke="currentColor" className="text-slate-100 dark:text-slate-800"`) dan busur indikator dinamis (`stroke={moisture < 40 ? "#ef4444" : "#10b981"}`) yang panjang garisnya menyesuaikan persentase `moisture`, lengkap dengan efek *drop-shadow glow*.
  - Di tengah bawah busur, tampilkan angka `${moisture}%` (`text-4xl md:text-5xl font-black tabular-nums`) dan teks `KELEMBABAN` (`text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1`).
- [x] **2.3. Status Pill, Ambang Batas & Kalibrasi Footer:**
  - Bungkus teks status (`Tanah Kering! Perlu Disiram` / `Kondisi Tanah Optimal`) di dalam kapsul lebar (`w-full py-2.5 px-4 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center justify-center gap-2` untuk kondisi kering, dan warna `emerald` untuk kondisi optimal).
  - Di atas *progress bar*, tampilkan label `Ambang Kering (0%)` di kiri dan `Kondisi Ideal (60–80%)` di kanan (`text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex justify-between`).
  - Tambahkan baris *footer* di bagian bawah kartu (`pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs`): teks `Deviasi Sensor: 0.0%` di kiri, dan teks aksi `Kalibrasi Ulang →` (`text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:underline`) di kanan.

---

## Tahap 3: Upgrade Panel AgriSmart AI (`src/components/Chatbot.jsx`)
- [x] **3.1. Header & Badge Online Asisten:**
  - Pada header `AgriSmart AI`, tambahkan *badge* kapsul di sisi kanan bertuliskan `Online Asisten` (`bg-black/20 dark:bg-emerald-500/15 border border-white/15 dark:border-emerald-500/30 text-white dark:text-emerald-300 text-xs px-3 py-1 rounded-full font-medium`).
- [x] **3.2. Avatar AI & Kotak Saran Cepat:**
  - Untuk setiap pesan dengan `msg.role === "model"`, tampilkan ikon avatar bulat (`w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1`) di sebelah kiri *bubble chat*.
  - Pertahankan tombol `Putar Suara` (`<Volume2 size={14} />`) di bawah *bubble* pesan AI.
  - Tepat di bawah tombol `Putar Suara` (pada pesan AI terakhir atau pesan pembuka), tambahkan kotak **Saran Cepat** (`mt-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl p-2.5 text-xs flex items-start gap-2`) dengan ikon `<Lightbulb size={15} className="shrink-0 mt-0.5 text-emerald-500" />` dan teks dinamis:
    - Jika `currentMoisture < 40`: `"Saran Cepat: Rekomendasi penyiraman 250ml–500ml untuk tanaman pot terdekat."`
    - Jika `currentMoisture >= 40`: `"Saran Cepat: Kelembaban terjaga baik, tunda penyiraman berikutnya."`

---

## Tahap 4: Upgrade Grafik Historis dengan 3 Kartu Statistik (`src/components/MoistureChart.jsx`)
- [x] **4.1. Header & Timeframe Selector Pills:**
  - Di sisi kanan header `Grafik Historis Kelembaban`, tambahkan grup tombol *timeframe* (`bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold border border-slate-200/60 dark:border-white/5`): tombol `6 Jam`, `24 Jam` (aktif: `bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm px-2.5 py-1 rounded-lg`), dan `7 Hari`.
- [x] **4.2. Perhitungan & Tampilan 3 Kartu Statistik Bawah:**
  - Hitung nilai statistik secara aman dari *array* `data`:
    - `maxVal`: Nilai tertinggi dari `data` (atau `0` jika kosong).
    - `avgVal`: Rata-rata dari `data` dengan 1 angka di belakang koma (atau `0.0` jika kosong).
    - `currentVal`: Nilai elemen terakhir dari `data` (atau `0` jika kosong).
  - Buat **Grid 3 Kolom** (`grid grid-cols-3 gap-3 mt-4 pt-2`) di bawah area grafik Recharts:
    1. **Kartu 1 (`Tertinggi`):** Latar netral (`bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-white/5 rounded-xl p-3 text-center`), menampilkan label `Tertinggi` dan angka `${maxVal}%` (`font-extrabold text-base tabular-nums`).
    2. **Kartu 2 (`Rata-rata`):** Latar netral serupa, menampilkan label `Rata-rata` dan angka `${avgVal}%`.
    3. **Kartu 3 (`Terkini`):** Latar dinamis (`bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400` jika `currentVal < 40`, atau warna `emerald` jika `>= 40`), menampilkan label `Terkini` dan angka `${currentVal}% (${currentVal < 40 ? 'Kritis' : 'Optimal'})`.

---

## Tahap 5: Upgrade Panel Visualisasi 3D (`src/components/Plant3D.jsx`)
- [x] **5.1. Penataan Header Atas & Status Pill Kanan:**
  - Ubah label pojok kiri atas menjadi *Top Header Bar* yang rapi di bagian atas kartu (`flex items-center justify-between px-5 pt-5 pb-2 z-10 relative`):
    - Kiri: Ikon `<Sprout size={18} className="text-emerald-500" />` + judul `Visualisasi 3D` (`font-bold text-sm text-slate-800 dark:text-white`).
    - Kanan: *Badge pill* (`px-3 py-1 rounded-full text-xs font-bold border`) dengan teks `Tanaman butuh air!` (warna *amber/yellow* saat `isDry`) atau `Tanaman tumbuh subur!` (warna *emerald* saat optimal).
- [x] **5.2. Bottom Status Bar:**
  - Tambahkan kapsul status di bagian bawah dalam kartu (`mx-5 mb-5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-2 text-xs font-semibold z-10 relative`):
    - Tampilkan ikon `<ThermometerSun size={15} />` atau `<Droplets size={15} />` beserta teks `Status: ` diikuti `<span className={isDry ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"}>{isDry ? "Defisit Air" : "Terhidrasi Optimal"}</span>`.
- [x] **5.3. Pertahankan Objek 3D:** Pastikan `<Canvas>` Three.js dan model pohon *low-poly* tetap berada di tengah ruang kartu dengan proporsi yang pas tanpa menabrak *header* maupun *footer* kartu.

---

## Tahap 6: Verifikasi Akhir & Quality Assurance (QA)
- [x] **6.1. Pemeriksaan Linter & Import:** Pastikan seluruh ikon baru dari `lucide-react` (`LayoutDashboard`, `LineChart`, `RefreshCw`, `ShieldCheck`, `Lightbulb`, `Sparkles`, dll.) sudah di-*import* dengan benar tanpa ada *unused variables*.
- [x] **6.2. Cek Mode Terang & Gelap:** Pastikan ketika *switch* `Mode Gelap` di *sidebar* diklik, area kerja utama berubah mulus antara tampilan terang bersih (persis `screen.jpg`) dan tampilan gelap futuristik (persis desain *dark mode* sebelumnya).