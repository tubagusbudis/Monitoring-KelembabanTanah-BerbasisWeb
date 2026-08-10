import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Loader2, Bot} from "lucide-react";
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    // Tambahkan pesan user ke UI
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      // Inisialisasi Gemini API
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      // Prompt Engineering: Gabungkan pertanyaan user dengan data kelembaban real-time
      const prompt = `
        Kamu adalah asisten pertanian pintar bernama AgriSmart AI. 
        Fakta saat ini: Kelembaban tanah di lokasi pengguna adalah ${currentMoisture}%.
        Pertanyaan pengguna: "${userText}"
        Tugasmu: Berikan jawaban atau rekomendasi yang akurat, singkat (maksimal 3 paragraf pendek), santai, dan relevan dengan kondisi kelembaban tanah tersebut (misal apakah cocok untuk tanaman tertentu, kebun, atau lapangan olahraga). Jangan gunakan bahasa yang kaku.
        ATURAN WAJIB: Kamu harus selalu menggunakan format cetak tebal (markdown bold) pada nama kategori kelembaban atau kata kunci penting (contoh: statusnya **cukup atau sedang**, **sangat kering**, atau **terlalu basah**). Jangan gunakan bahasa yang kaku.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      // Tambahkan balasan AI ke UI
      setMessages((prev) => [...prev, { role: "model", text: response }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Waduh, koneksi ke otak AI-ku lagi gangguan nih. Coba cek API Key di file .env ya!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="flex flex-col h-[400px] w-full max-w-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
      {/* Header Chat */}
      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
        <Bot size={24} />
        <div>
          <h3 className="font-bold">AgriSmart AI</h3>
          <p className="text-xs opacity-80">Powered by Gemini 3.1 Flash lite</p>
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
              {/* Bungkus pesannya pakai tag ini */}
              <ReactMarkdown>{msg.text}</ReactMarkdown>
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