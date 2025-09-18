import { useCallback, useEffect, useState } from "react";
import { sendMessageStream, getHistory, resetSession } from "./api/api";
import { useSession } from "./hooks/useSession";
import "./App.scss";

interface Message {
  role: "user" | "assistant";
  text: string;
}

function App() {
  const { sessionId, sessions, switchSession, newSession, deleteSession, isLoading } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Load history when session changes
  useEffect(() => {
    if (sessionId && !isLoading) {
      (async () => {
        try {
          const history = await getHistory(sessionId);
          setMessages(history);
        } catch (error) {
          console.error("Failed to load history:", error);
          setMessages([]);
        }
      })();
    }
  }, [sessionId, isLoading]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !sessionId || isSending) return;

    setIsSending(true);
    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    let assistantMsg: Message = { role: "assistant", text: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      await sendMessageStream(sessionId, input, (token) => {
        assistantMsg.text += token;
        setMessages((prev) => [
          ...prev.slice(0, prev.length - 1),
          { ...assistantMsg },
        ]);
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Update the assistant message with error
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        { role: "assistant", text: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }

    setInput("");
  }, [input, sessionId, isSending]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleSend]);

  const handleResetSession = async () => {
    if (!sessionId) return;
    
    try {
      await resetSession(sessionId);
      setMessages([]);
    } catch (error) {
      console.error("Failed to reset session:", error);
    }
  };

  const handleNewSession = async () => {
    try {
      await newSession();
      setMessages([]);
    } catch (error) {
      console.error("Failed to create new session:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Sidebar for session management */}
      <div className="sidebar">
        <div className="sidebar__header">
          <button onClick={handleNewSession} className="new-chat-btn">
            New Chat
          </button>
        </div>
        
        <div className="sidebar__content">
          <h3 className="title">Chat History</h3>
          {sessions.length === 0 ? (
            <p className="empty-state">No chat history</p>
          ) : (
            <div className="sessions-list">
              {sessions.map((id, index) => (
                <div
                  key={id}
                  className={`session-item ${sessionId === id ? 'active' : ''}`}
                  onClick={() => switchSession(id)}
                >
                  <span className="session-item__text">
                    Chat {sessions.length - index}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(id);
                    }}
                    className="session-item__delete"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="main-chat">
        {/* Header */}
        <div className="main-chat__header">
          <h1 className="title">AI News Chatbot</h1>
          <button
            onClick={handleResetSession}
            className="reset-btn"
            disabled={messages.length === 0}
          >
            Reset Session
          </button>
        </div>

        {/* Messages */}
        <div className="main-chat__messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>Start a conversation about news topics!</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <div className={`message__content ${m.role}`}>
                  {m.text ? (
                    <div className="text">{m.text}</div>
                  ) : (
                    <div className="loading">
                      <div className="spinner"></div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="main-chat__input">
          <div className="input-container">
            <input
              className="input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about news topics..."
              disabled={isSending}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isSending}
            >
              {isSending ? (
                <div className="spinner"></div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;