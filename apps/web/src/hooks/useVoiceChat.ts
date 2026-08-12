"use client";

import { useCallback, useRef, useEffect } from "react";
import { useChatStore, ChatLanguage } from "@/lib/chatStore";

const LANG_CODE_MAP: Record<ChatLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
};

// Greeting messages per language
const GREETINGS: Record<ChatLanguage, string> = {
  en: "Hello! I'm KisanSeva Saathi. How can I help you today? You can ask me about crop diseases, market prices, or government schemes.",
  hi: "नमस्ते! मैं किसान सेवा साथी हूं। आज मैं आपकी कैसे मदद कर सकता हूं? आप फसल रोगों, बाजार भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।",
  bn: "নমস্কার! আমি কিষান সেবা সাথী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি? আপনি আমাকে ফসলের রোগ, বাজারের দাম বা সরকারি স্কিম সম্পর্কে জিজ্ঞাসা করতে পারেন।",
};

// Best voice for language — waits for voices list to populate (Chrome async)
function getBestVoice(synth: SpeechSynthesis, lang: ChatLanguage): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  const code = LANG_CODE_MAP[lang];
  const primary = code.split("-")[0]; // "hi", "en"

  // 1. Exact locale match
  const exact = voices.find((v) => v.lang.toLowerCase() === code.toLowerCase());
  if (exact) return exact;

  // 2. Same primary language
  const sameRoot = voices.find((v) => v.lang.toLowerCase().startsWith(primary));
  if (sameRoot) return sameRoot;

  // 3. Fallback: null means browser default
  return null;
}

export function useVoiceChat(onTranscript?: (text: string) => void) {
  const {
    language,
    messages,
    isListening,
    isSpeaking,
    isLoading,
    addMessage,
    setListening,
    setSpeaking,
    setLoading,
  } = useChatStore();

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesCachedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    synthRef.current = window.speechSynthesis;

    // Chrome loads voices asynchronously — trigger early cache
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
      voicesCachedRef.current = true;
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      voicesCachedRef.current = true;
    } else {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices, { once: true });
    }

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const isSpeechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const speak = useCallback(
    (text: string, lang: ChatLanguage = language) => {
      if (!synthRef.current || !text.trim()) return;
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_CODE_MAP[lang];
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      // Attempt to find best voice; if none found browser uses default with lang hint
      const voice = getBestVoice(synthRef.current, lang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (e) => {
        setSpeaking(false);
      };

      synthRef.current.speak(utterance);
    },
    [language, setSpeaking]
  );

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setSpeaking(false);
  }, [setSpeaking]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      addMessage({ role: "user", text });
      setLoading(true);

      // Build history for context (last 6 messages)
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      try {
        const res = await fetch(`/api/agent/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text, language, context: { history } }),
        });

        const data = await res.json();
        
        // Parse the nested result structure from our API
        const replyText = data?.result?.text || "I'm sorry, I couldn't understand that.";

        addMessage({
          role: "model",
          text: replyText,
          // Extract actions if present in the text structure in the future
        });

        // Auto-speak the response
        speak(replyText, language);
      } catch {
        const errMsg = "Sorry, I couldn't connect to the server. Please try again.";
        addMessage({ role: "model", text: errMsg });
        speak(errMsg, language);
      } finally {
        setLoading(false);
      }
    },
    [messages, language, addMessage, setLoading, speak]
  );

  const startListening = useCallback(() => {
    if (!isSpeechSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;       // keeps listening until .stop() is called
    recognition.interimResults = true;   // show live interim text in the input
    recognition.lang = LANG_CODE_MAP[language];

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event: any) => {
      // Build running transcript from all results
      let interim = "";
      let finalText = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      // Show live text in the textarea via callback
      const displayText = (finalText + interim).trim();
      if (onTranscript && displayText) {
        onTranscript(displayText);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, isSpeechSupported, onTranscript, setListening]);

  // Stop listening and finalise — whatever is in the input textarea stays there for user to send
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
    // NOTE: we intentionally do NOT auto-send here.
    // The transcript is in the textarea — user clicks Send or presses Enter.
  }, [setListening]);

  const sendGreeting = useCallback(
    (lang: ChatLanguage) => {
      const greeting = GREETINGS[lang];
      addMessage({ role: "model", text: greeting, action: null });
      speak(greeting, lang);
    },
    [addMessage, speak]
  );

  return {
    isSpeechSupported,
    isListening,
    isSpeaking,
    isLoading,
    startListening,
    stopListening,
    sendMessage,
    speak,
    stopSpeaking,
    sendGreeting,
  };
}
