import { useState, useEffect, useRef } from "react";
import Footer from "../components/footer";
import ReactMarkdown from "react-markdown";
import type { Message } from "../types/Message";
import "../styles/ai.css";

export default function AI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los mensajes");
        }

        const data = await response.json();

        setMessages(data);
      } catch (error) {
        console.error("Error cargando mensajes:", error);
      }
    }

    loadMessages();
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage() {
    const message = input.trim();

    if (!message || loading) return;

    const userMessage: Message = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al comunicarse con la IA");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("Error enviando mensaje:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "No pude procesar tu mensaje. Intenta nuevamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  }

  return (
    <div className="ai-layout">
      <main className="ai-page">

        <div className="background">
          <span className="bubble b1"></span>
          <span className="bubble b2"></span>
          <span className="bubble b3"></span>
        </div>

        <section className="ai-container">

          <div
            className="ai-messages"
            ref={messagesContainerRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.role === "user"
                    ? "user-message"
                    : "assistant-message"
                }`}
              >
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            ))}

            {loading && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          <div className="ai-input-area">
            <input
              value={input}
              className="ai-input"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              className="ai-button"
              disabled={loading || !input.trim()}
            >
              {loading ? "Pensando..." : "Enviar"}
            </button>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}