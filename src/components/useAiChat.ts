import { useCallback, useState } from "react"

// Conversational state for the CornerOrb's embedded assistant. Posts to
// a Cloudflare Worker that wraps a chat completion API; the orb only
// owns UI state — message history, input value, loading flag.

const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT as string

const FALLBACK = {
  role: "assistant" as const,
  content:
    "I'm having trouble connecting to my brain right now. Please reach out to me directly at kamilpinas@gmail.com!",
}

const GREETING = {
  role: "assistant" as const,
  content:
    "Hi, I'm Kamil. Ask me anything about my technical stack, engineering experience, or availability!",
}

export type ChatMessage = { role: "user" | "assistant"; content: string }

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(
    async (text: string) => {
      const body = text.trim()
      if (!body || isLoading) return
      if (body.length > 500) return

      const userMsg: ChatMessage = { role: "user", content: body }
      const next = [...messages, userMsg]
      setMessages(next)
      setIsLoading(true)

      // keep greeting + last 19 messages so payload stays bounded
      const toSend = next.length > 20 ? [next[0], ...next.slice(-19)] : next

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: toSend }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ])
      } catch (err) {
        console.error("AI Error:", err)
        setMessages((prev) => [...prev, FALLBACK])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isLoading],
  )

  return { messages, isLoading, sendMessage }
}
