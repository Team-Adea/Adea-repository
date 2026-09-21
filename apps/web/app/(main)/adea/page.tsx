"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function AdeaChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const busy = status === "submitted" || status === "streaming";

  return (
    <main>
      <h1>💬 Adea</h1>

      <div className="chat-log">
        {messages.length === 0 ? (
          <p className="chat-empty">
            This is where you talk to Adea, your partner in life. Ask about anything — money, goals,
            health, family — or just think out loud.
          </p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`chat-msg ${message.role}`}>
              {message.parts.map((part, i) =>
                part.type === "text" ? <span key={`${message.id}-${i}`}>{part.text}</span> : null,
              )}
            </div>
          ))
        )}
      </div>

      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          const text = input.trim();
          if (!text || busy) return;
          sendMessage({ text });
          setInput("");
        }}
      >
        <input
          value={input}
          placeholder="Message Adea…"
          onChange={(e) => setInput(e.currentTarget.value)}
          aria-label="Message Adea"
        />
        <button type="submit" disabled={busy || input.trim() === ""}>
          {busy ? "…" : "Send"}
        </button>
      </form>
    </main>
  );
}
