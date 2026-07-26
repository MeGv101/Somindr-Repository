import { useState, useEffect, useRef } from "react";
import Footer from '../components/footer';
import  ReactMarkdown from "react-markdown";
import type { Message } from "../types/Message";
import '../styles/ai.css'

export default function AI() {

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

 
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {

  async function loadMessages() {
    const token = localStorage.getItem("token");
    const response =
        await fetch(
            "/api/messages",
            {
            headers: {
                Authorization:
                `Bearer ${token}`,
            },
            }
        );

        const data =
        await response.json();

        setMessages(data);

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

    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages(prev => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: input,
          }),
        }
      );

      const data =
        await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  }

  return (
    <>
    <div className="ai-page">
      <div className="background">
        <span className="bubble b1"></span>
        <span className="bubble b2"></span>
        <span className="bubble b3"></span>
      </div>
      <div className="ai-container">
        <div className="ai-header">
        </div>
        <div className="ai-messages" ref={messagesContainerRef}>

          {messages.map((message, index) => (
            <div key={index}
              className={`message ${message.role === "user"
                  ? "user-message"
                  : "assistant-message"}`}>
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
          )
          )}
        </div>
        <div className="ai-input-area">
          <input
            value={input}
            className="ai-input"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..." />
          <button
            onClick={sendMessage}
            className="ai-button"
            disabled={loading}
          >
            {loading
              ? "Pensando..."
              : "Enviar"}
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}