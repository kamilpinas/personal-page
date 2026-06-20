import { useEffect, useRef, useState } from "react"
import type { ChatMessage } from "./useAiChat"

// The expanded chat UI inside the CornerOrb. Pure presentation — message
// history, typing indicator, suggestion chips, input form. The
// container owns the chat state and passes it down.

const SUGGESTIONS = [
  "What is your tech stack?",
  "Tell me about your last role",
  "Are you open to B2B / remote?",
]

type Props = {
  messages: ChatMessage[]
  isLoading: boolean
  onSend: (text: string) => void
  onClose: () => void
  onFocus: () => void
}

export function ChatPanel({
  messages,
  isLoading,
  onSend,
  onClose,
  onFocus,
}: Props) {
  const [input, setInput] = useState("")
  const historyEndRef = useRef<HTMLDivElement>(null)

  // keep the latest message in view as the conversation grows
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSend(input)
    setInput("")
  }

  return (
    <>
      <div className="corner-orb__header">
        <span className="corner-orb__title">Kamil.AI</span>
        <span className="corner-orb__status">Online</span>
        <button
          className="corner-orb__close"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          ✕
        </button>
      </div>

      <div className="corner-orb__chat" onClick={onFocus}>
        <div className="corner-orb__history">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`corner-orb__msg corner-orb__msg--${m.role}`}
            >
              <span className="corner-orb__msg-sender">
                {m.role === "user" ? "You" : "AI"}
              </span>
              <p className="corner-orb__msg-text">{m.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="corner-orb__msg corner-orb__msg--assistant">
              <span className="corner-orb__msg-sender">AI</span>
              <div className="corner-orb__typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={historyEndRef} />
        </div>

        {!isLoading && messages.length <= 2 && (
          <div className="corner-orb__suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="corner-orb__suggestion-chip"
                onClick={() => onSend(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form className="corner-orb__form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={onFocus}
            disabled={isLoading}
            maxLength={500}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            →
          </button>
        </form>
      </div>
    </>
  )
}
