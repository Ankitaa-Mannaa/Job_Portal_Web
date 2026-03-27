import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Send, Bot, User, Clock, X, MessageCircle, Sparkles } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I can help you analyze and improve your resume. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    const currentInput = input;
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API}/api/chat/`,
        { question: currentInput },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const answer = res.data.answer || "Sorry, I couldn't process that.";
      setMessages([...newMessages, { role: "bot", content: answer }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Failed to get a response. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`${API}/api/chat/history`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setHistory(res.data || []);
    } catch (err) {
      console.error("Failed to load chat history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openHistory = () => {
    setShowHistory(true);
    loadHistory();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-white/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                AI Resume Assistant
              </h1>
              <p className="text-sm text-blue-600/70">Powered by advanced AI</p>
            </div>
          </div>
          <button
            onClick={openHistory}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">History</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {msg.role === "bot" && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-2xl px-5 py-4 rounded-2xl shadow-md border ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-12 border-blue-500/20"
                    : "bg-white/90 backdrop-blur-sm text-gray-800 mr-12 border-blue-100/50"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === "user" && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-md border border-blue-100/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-blue-600 text-sm">AI is thinking...</span>
                  <div className="flex items-center gap-1 ml-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center animate-fade-in">
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl shadow-sm">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-md border-t border-blue-100/50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about your resume..."
                className="w-full resize-none rounded-2xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-sm px-5 py-4 text-sm placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[56px] max-h-32 shadow-sm"
                rows={1}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
              <div className="absolute right-3 top-3 text-xs text-blue-400">
                Press Enter to send
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-blue-100/50">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-100/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chat History</h3>
                  <p className="text-sm text-blue-600">Your previous conversations</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingHistory ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex items-center gap-3 text-blue-600">
                    <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Loading your chat history...</span>
                  </div>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h4>
                  <p className="text-gray-500 text-sm">Start chatting to see your history here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((h, i) => (
                    <div key={i} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl p-5 hover:shadow-md transition-all duration-200">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Question</span>
                        </div>
                        <p className="text-sm text-gray-800 pl-7">{h.question}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Answer</span>
                        </div>
                        <p className="text-sm text-gray-700 pl-7 whitespace-pre-wrap">{h.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}