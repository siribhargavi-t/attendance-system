import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../context/UserContext";
import MainLayout from "../../components/Layout/MainLayout";
import {
  FiMail, FiSend, FiUser, FiSearch,
  FiChevronRight, FiCheckCircle, FiAlertCircle
} from "react-icons/fi";

const Mail = () => {
  const { user } = useContext(UserContext);
  const role = user?.role || "student";

  const [recipients, setRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(255, 255, 255, 0.8)";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(102, 126, 234, 0.15)";
  const paneBg = isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.4)";

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const token = userData?.token;
        const res = await axios.get("/api/mail/recipients", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecipients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch recipients error:", err);
        setRecipients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipients();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedRecipient || !subject.trim() || !message.trim()) return;

    try {
      setSending(true);
      setStatus({ type: "", text: "" });
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const token = userData?.token;

      await axios.post("/api/mail/send", {
        toEmail: selectedRecipient?.email,
        subject,
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus({ type: "success", text: "Message delivered successfully!" });
      setSubject("");
      setMessage("");
      // Keep selected recipient for multi-message ease? No, let's clear or reset.
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: "Failed to deliver message." });
    } finally {
      setSending(false);
    }
  };

  const filteredRecipients = recipients?.filter(r => 
    (r?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (r?.email || "").toLowerCase().includes(search.toLowerCase())
  ) || [];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 h-full flex flex-col">
        {/* Header Overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-6 rounded-3xl overflow-hidden relative"
          style={{ 
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))",
            border: `1px solid ${cardBorder}`,
            backdropFilter: "blur(20px)"
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg">
              <FiMail size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black gradient-text">Communication Hub</h1>
              <p style={{ color: mutedColor, fontWeight: 500 }}>
                {role === "student" ? "Connect with your faculty members" : "Secure messaging with your students"}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[500px]">
          {/* List Pane */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-80 flex flex-col rounded-3xl overflow-hidden border"
            style={{ background: paneBg, borderColor: cardBorder, backdropFilter: "blur(24px)" }}
          >
            <div className="p-4 border-b" style={{ borderColor: cardBorder }}>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Find recipient..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                  style={{ color: textColor, border: `1px solid ${cardBorder}` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40 opacity-50">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-xs">Fetching contacts...</p>
                </div>
              ) : filteredRecipients.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                   <p className="text-sm">No contacts found</p>
                </div>
              ) : (
                filteredRecipients.map((r, i) => (
                  <motion.div
                    key={r.email}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedRecipient(r)}
                    className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-all hover:translate-x-1 ${
                      selectedRecipient?.email === r.email 
                        ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20" 
                        : "hover:bg-indigo-500/10"
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner"
                      style={{ 
                        background: selectedRecipient?.email === r.email ? "rgba(255,255,255,0.2)" : "linear-gradient(135deg, #6366f1 0%, #a18cd1 100%)",
                        color: "#fff"
                      }}
                    >
                      {(r.name?.[0] || "?").toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm truncate">{r.name}</p>
                      <p className={`text-[10px] truncate ${selectedRecipient?.email === r.email ? "text-white/70" : "text-gray-400 font-medium"}`}>{r.email}</p>
                    </div>
                    {selectedRecipient?.email === r.email && <FiChevronRight size={14} />}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Compose Pane */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 rounded-3xl overflow-hidden border flex flex-col"
            style={{ background: paneBg, borderColor: cardBorder, backdropFilter: "blur(24px)" }}
          >
            {selectedRecipient ? (
              <form onSubmit={handleSend} className="h-full flex flex-col p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-black shadow-2xl">
                       {selectedRecipient.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-black" style={{ color: textColor }}>{selectedRecipient.name}</h2>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: mutedColor }}>Sending to {selectedRecipient.email}</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {status.text && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg ${
                          status.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                         {status.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                         {status.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: mutedColor }}>Subject Line</label>
                    <input 
                      type="text"
                      placeholder="What is this regarding?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-white/5 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold"
                      style={{ color: textColor, border: `1px solid ${cardBorder}` }}
                      required
                    />
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: mutedColor }}>Message Content</label>
                    <textarea 
                      placeholder="Draft your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full flex-1 px-5 py-5 rounded-3xl bg-white/5 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none font-medium"
                      style={{ color: textColor, border: `1px solid ${cardBorder}` }}
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                   <motion.button
                     whileHover={{ scale: 1.02, translateY: -2 }}
                     whileTap={{ scale: 0.98 }}
                     disabled={sending}
                     type="submit"
                     className="px-10 py-4 rounded-2xl font-black text-white shadow-2xl transition-all disabled:opacity-50 flex items-center gap-3"
                     style={{ 
                       background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                       boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)"
                     }}
                   >
                     {sending ? "Delivering..." : <><FiSend /> Dispatch Message</>}
                   </motion.button>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
                  <FiMail size={40} />
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: textColor }}>No Recipient Selected</h3>
                <p className="max-w-xs text-sm font-medium" style={{ color: mutedColor }}>Select a contact from the list on the left to start a new communication.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Mail;