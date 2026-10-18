"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Square, Loader2, Sparkles } from "lucide-react"

export function VoiceAIButton() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isClient, setIsClient] = useState(false)
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'tr-TR'

        recognitionRef.current.onresult = async (event: any) => {
          const text = event.results[0][0].transcript
          setTranscript(text)
          setIsListening(false)
          handleAiLogic(text)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
          setIsProcessing(false)
        }
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      setTranscript("")
      setAiResponse("")
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch(e) {
        console.error("Could not start microphone", e)
      }
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() // Stop previous speaking
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'tr-TR'
      utterance.rate = 1.05
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleAiLogic = async (text: string) => {
    setIsProcessing(true)
    
    // IdeaAI Marketing Agent Logic
    const lowerText = text.toLowerCase()
    let responseText = ""
    let shouldRedirect = false

    if (lowerText.includes("kayıt") || lowerText.includes("indir") || lowerText.includes("satın") || lowerText.includes("almak")) {
      responseText = "Harika bir karar! Sizi hemen Microsoft Store'a ışınlıyorum. IdeaAI ile kodlama hızınızı 10 katına çıkarmaya hazır olun."
      shouldRedirect = true
    } else if (lowerText.includes("fark") || lowerText.includes("neden") || lowerText.includes("rakip")) {
      responseText = "Rakiplerimizden en büyük farkımız, tamamen sizin makinenizde, sıfır veri sızıntısıyla çalışmamızdır. Github Copilot sadece satırları tamamlar, IdeaAI ise sizin için tüm bir projeyi otonom olarak inşa eder."
    } else if (lowerText.includes("nasılsın") || lowerText.includes("merhaba")) {
      responseText = "Merhaba! Ben IdeaAI'ın otonom zekasıyım. Doğuş Yılmaz tarafından geliştirildim. Sana nasıl yardımcı olabilirim?"
    } else {
      responseText = "Bunu anladım! Ben IdeaAI, arka planda otonom çalışan ve sizin adınıza projeler geliştiren bir sistemim. Daha fazlasını keşfetmek isterseniz uygulamamızı indirebilirsiniz."
    }

    setAiResponse(responseText)
    speakText(responseText)
    setIsProcessing(false)

    if (shouldRedirect) {
      setTimeout(() => {
        window.open("ms-windows-store://pdp/?ProductId=9P1J8S7CCW4X", "_blank") 
      }, 3500)
    }
  }

  if (!isClient || !recognitionRef.current) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat bubble */}
      <AnimatePresence>
        {(transcript || aiResponse) && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl rounded-br-sm shadow-2xl shadow-primary/20 max-w-[320px] mb-2"
          >
            {transcript && (
              <div className="mb-3">
                <span className="text-xs font-semibold text-primary mb-1 block">Sen</span>
                <p className="text-sm text-white/80 leading-relaxed">"{transcript}"</p>
              </div>
            )}
            {aiResponse && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> IdeaAI
                </span>
                <p className="text-sm text-white leading-relaxed font-medium">{aiResponse}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`group relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-500 hover:scale-110 ${
          isListening ? 'bg-red-500' : 'bg-primary'
        }`}
      >
        {isListening && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        )}
        
        {isProcessing ? (
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        ) : isListening ? (
          <Square className="h-6 w-6 text-white fill-current animate-pulse" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  )
}
