import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Send,
  Loader2,
  Bot,
  Volume2,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Chatbot({ currentMoisture }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Halo! Aku asisten AgriSmart. Mau nanya apa nih soal kondisi tanah hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // FUNGSI Text-to-Speech
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      // Bersihkan teks dari simbol Markdown (*, _, #) biar gak ikut dibaca
      const cleanText = text.replace(/[*_#`]/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "id-ID";
      utterance.rate = 1.25;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Browser kamu tidak mendukung fitur Text-to-Speech.");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite",
      });

      const prompt = `
        Kamu adalah asisten pertanian pintar bernama AgriSmart AI. 
        Fakta saat ini: Kelembaban tanah di lokasi pengguna adalah ${currentMoisture}%.
        Pertanyaan pengguna: "${userText}"
        Tugasmu: Berikan jawaban atau rekomendasi yang akurat, singkat (maksimal 3 paragraf pendek), santai, dan relevan dengan kondisi kelembaban tanah tersebut.
        ATURAN WAJIB: Kamu harus selalu menggunakan format cetak tebal (markdown bold) pada nama kategori kelembaban atau kata kunci penting. Jangan gunakan bahasa yang kaku.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      setMessages((prev) => [...prev, { role: "model", text: response }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMsg =
        "Waduh, koneksi ke otak AI-ku lagi gangguan nih. Coba cek API Key di file .env ya!";
      setMessages((prev) => [...prev, { role: "model", text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 3.1 Card Wrapper & Header Kaca Gelap
    <div className="flex flex-col h-full min-h-[420px] w-full max-w-full bg-white dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500/30 shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden transition-all duration-300">
      {/* 3.1 Header Chat Gradasi Zamrud Gelap */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-teal-950/90 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm md:text-base text-slate-100 tracking-tight">
                AgriSmart AI
              </h3>
            </div>
            <p className="text-xs text-emerald-200/70 font-medium">
              Powered by Gemini 3.1 Flash
            </p>
          </div>
        </div>

        {/* 3.1 Badge Online Asisten */}
        <div className="bg-black/25 dark:bg-emerald-500/15 border border-white/15 dark:border-emerald-500/30 text-white dark:text-emerald-300 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Online Asisten</span>
        </div>
      </div>

      {/* 3.2 Area Chat & Bubble Pesan */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start items-start gap-2.5"
            }`}
          >
            {/* Avatar AI Bulat */}
            {msg.role === "model" && (
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Sparkles size={14} />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-sm shadow-md"
                  : "bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/[0.06] text-slate-700 dark:text-slate-200 rounded-tl-sm shadow-sm"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>

              {/* Tombol Speaker Khusus AI */}
              {msg.role === "model" && (
                <div className="mt-2.5 flex flex-col gap-2">
                  <button
                    onClick={() => speakText(msg.text)}
                    className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 hover:bg-emerald-500/20 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 border border-transparent hover:border-emerald-500/30 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer w-fit"
                    title="Bacakan teks ini"
                  >
                    <Volume2 size={14} />
                    <span className="text-xs font-medium">Putar Suara</span>
                  </button>

                  {/* 3.2 Kotak Saran Cepat Kontekstual */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl p-2.5 text-xs flex items-start gap-2">
                    <Lightbulb
                      size={15}
                      className="shrink-0 mt-0.5 text-emerald-500"
                    />
                    <span>
                      {currentMoisture < 40
                        ? "Saran Cepat: Rekomendasi penyiraman 250ml–500ml untuk tanaman pot terdekat."
                        : "Saran Cepat: Kelembaban terjaga baik, tunda penyiraman berikutnya."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
              <Sparkles size={14} />
            </div>
            <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200/80 dark:border-white/[0.06] text-emerald-500">
              <Loader2 className="animate-spin" size={18} />
            </div>
          </div>
        )}
      </div>

      {/* 3.3 Area Input Box */}
      <div className="p-3 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/80 dark:border-white/[0.08] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Tanya rekomendasi kelembaban tanah..."
          className="flex-1 p-2.5 px-3.5 bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 rounded-xl outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          aria-label="Kirim pertanyaan"
          className="p-2.5 px-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-sm hover:shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

