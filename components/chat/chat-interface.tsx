"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Send, MoreVertical, Phone, Video, Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getConversations, getMessages, sendMessage, type Conversation, type Message } from "@/lib/api/chat"
import { auth } from "@/lib/firebase"

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeChat, setActiveChat] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [loadingChats, setLoadingChats] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load conversations on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getConversations()
        setConversations(chats)
        if (chats.length > 0) {
          setActiveChat(chats[0])
        }
      } catch (err) {
        console.error("Failed to load conversations", err)
      } finally {
        setLoadingChats(false)
      }
    }
    fetchChats()
  }, [])

  // Load messages when active chat changes
  useEffect(() => {
    if (!activeChat) return
    let isMounted = true
    const fetchMsgs = async () => {
      setLoadingMessages(true)
      try {
        const msgs = await getMessages(activeChat.id)
        if (isMounted) setMessages(msgs)
      } catch (err) {
        console.error("Failed to load messages", err)
      } finally {
        if (isMounted) setLoadingMessages(false)
      }
    }
    fetchMsgs()
    return () => { isMounted = false }
  }, [activeChat])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!activeChat || !messageText.trim() || sending) return

    const textToSend = messageText.trim()
    setMessageText("")
    setSending(true)

    // Optimistic update
    const currentUser = auth.currentUser
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUser?.uid || "me",
      text: textToSend,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempMsg])
    
    // Update conversation last message optimistically
    setConversations((prev) => 
      prev.map(c => c.id === activeChat.id ? { ...c, lastMessage: textToSend, lastMessageAt: new Date().toISOString() } : c)
    )

    try {
      await sendMessage(activeChat.id, textToSend)
      // Re-fetch to get real ID and timestamp if desired, or just leave optimistic
      const msgs = await getMessages(activeChat.id)
      setMessages(msgs)
    } catch (err) {
      console.error("Failed to send message", err)
      // Revert optimistic if failed (simplified here)
    } finally {
      setSending(false)
    }
  }

  const currentUserUid = auth.currentUser?.uid

  return (
    <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r border-[#e5e5e5] bg-[#fafafa]">
        <div className="p-4 border-b border-[#e5e5e5]">
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full rounded-xl border border-[#e0e0e0] bg-white py-2 pl-9 pr-4 text-sm text-foreground focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="flex justify-center p-8 text-muted-foreground"><Loader2 className="size-6 animate-spin" /></div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No conversations yet. Connect with someone to start chatting!</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-[#e5e5e5] p-4 text-left transition-colors hover:bg-muted",
                  activeChat?.id === conv.id ? "bg-brand-blue/5" : ""
                )}
              >
                <div className="relative shrink-0">
                  <div className="flex size-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue font-bold text-lg">
                    {conv.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground truncate">{conv.otherUser.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                      {new Date(conv.lastMessageAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="truncate text-xs text-muted-foreground">
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col bg-white">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex h-16 items-center justify-between border-b border-[#e5e5e5] px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue font-bold">
                  {activeChat.otherUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{activeChat.otherUser.name}</h3>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {activeChat.otherUser.headline || "Professional"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <button className="hover:text-foreground transition-colors"><Phone className="size-5" /></button>
                <button className="hover:text-foreground transition-colors"><Video className="size-5" /></button>
                <button className="hover:text-foreground transition-colors"><Info className="size-5" /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fbfbfb]">
              {loadingMessages ? (
                <div className="flex justify-center p-8 text-muted-foreground"><Loader2 className="size-6 animate-spin" /></div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Say hi to {activeChat.otherUser.name}!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUserUid
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm",
                          isMe
                            ? "bg-brand-blue text-white rounded-br-none"
                            : "bg-white border border-[#e5e5e5] text-foreground rounded-bl-none"
                        )}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={cn(
                            "mt-1 block text-[10px]",
                            isMe ? "text-brand-blue-light/70" : "text-muted-foreground"
                          )}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSend} className="border-t border-[#e5e5e5] p-4 bg-white">
              <div className="flex items-center gap-2 rounded-full border border-[#e0e0e0] bg-[#f5f5f5] pl-4 pr-2 py-2 focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || sending}
                  className="flex size-8 items-center justify-center rounded-full bg-brand-blue text-white transition-colors hover:bg-brand-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-50"
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  )
}
