import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Loader2, Bot, Volume2 } from "lucide-react"; // <-- Tambah import Volume2
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
      // Hentikan suara yang lagi jalan biar gak numpuk
      window.speechSynthesis.cancel();

      // Bersihkan teks dari simbol Markdown (*, _, #) biar gak ikut dibaca
      const cleanText = text.replace(/[*_#`]/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "id-ID"; // Set bahasa Indonesia
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
      // Nama model sesuai yang udah berhasil kamu pakai
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

      // Catatan: Pemanggilan speakText() otomatis dihapus dari sini
      // Biar suaranya murni dikendalikan dari tombol aja!
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
    <div className="flex flex-col h-[400px] w-full max-w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
      {/* Header Chat */}
      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
        <Bot size={24} />
        <div>
          <h3 className="font-bold">AgriSmart AI</h3>
          <p className="text-xs opacity-80">Powered by Gemini</p>
        </div>
      </div>

      {/* Area Pesan */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50 dark:bg-gray-800/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-emerald-500 text-white rounded-tr-sm"
                  : "bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-tl-sm shadow-sm"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>

              {/* TOMBOL SPEAKER KHUSUS AI */}
              {msg.role === "model" && (
                <button
                  onClick={() => speakText(msg.text)}
                  className="mt-3 flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-gray-500 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-md transition-colors cursor-pointer w-fit"
                  title="Bacakan teks ini"
                >
                  <Volume2 size={14} />
                  <span className="text-xs font-medium">Putar Suara</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              <Loader2 className="animate-spin" size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Area Input Box */}
      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Tanya soal kecocokan tanah..."
          className="flex-1 p-2 bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl outline-none text-sm text-gray-800 dark:text-white transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-xl transition-colors cursor-pointer"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
