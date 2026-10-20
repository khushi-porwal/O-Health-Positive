
import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { sendChatMessage } from "../../../services/chatbotService";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Namaste! 👋 Welcome to O Positive Health. I'm your AI assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSubmit(event) {
    event.preventDefault();

    const question = input.trim();

    if (!question || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
    ]);

    setInput("");
    setError("");
    setLoading(true);

    try {
      const data = await sendChatMessage(question);

      if (!data.success) {
        throw new Error(
          data.message || "Unable to get a response."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "bot",
          text: data.reply || "Please try asking again.",
        },
      ]);
    } catch (err) {
      console.error(
        "Chatbot request failed:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to connect right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ngo-chatbot">
      {isOpen && (
        <section
          className="ngo-chat-window"
          aria-label="O Positive Health AI assistant"
        >
          <header className="ngo-chat-header">
            <div className="ngo-chat-avatar">O+</div>

            <div className="ngo-chat-heading">
              <h3>O Positive Health</h3>
              <p>AI Healthcare Assistant</p>
            </div>

            <button
              type="button"
              className="ngo-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </header>

          <div
            className="ngo-chat-messages"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ngo-chat-message ${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="ngo-chat-message bot">
                Thinking...
              </div>
            )}

            {error && (
              <div className="ngo-chat-error" role="alert">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            className="ngo-chat-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask us anything..."
              aria-label="Your message"
              maxLength={4000}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>

          <p className="ngo-chat-disclaimer">
            AI-generated answers may not always be accurate.
            For official assistance, contact our team.
          </p>
        </section>
      )}

      <button
        type="button"
        className="ngo-chat-toggle"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}

export default Chatbot;
