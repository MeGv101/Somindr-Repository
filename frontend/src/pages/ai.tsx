import { useState, useEffect } from "react";
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


    useEffect(() => {

  async function loadMessages() {
    const token = localStorage.getItem("token");
    const response =
        await fetch(
            "http://localhost:3000/messages",
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
        "http://localhost:3000/chat",
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

  return (
    <div className="ai-container">
      <div className="ai-header">Somindr AI</div>
      <div className="ai-messages">
        {messages.map((message, index) => (
            <div key={index}
                className={`message ${
            message.role === "user"
                ? "user-message"
                : "assistant-message"
            }`}>
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
            onChange={(e) =>
            setInput(e.target.value)
            }
            placeholder="Escribe un mensaje..."
        />
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
      
  );
}