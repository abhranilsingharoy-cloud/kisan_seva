import re

with open('apps/web/src/app/(app)/agent/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = '''  const startListening = () => {
    // If already listening, stop
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // Check browser support first
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addSystemMessage('🎙️ Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge for voice input.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    const langMap: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN' };
    recognition.lang = langMap[selectedLang] || 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTrans = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalTrans += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setInputText(finalTrans || interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => {
        const btn = document.getElementById('send-message-btn') as HTMLButtonElement;
        if (btn && !btn.disabled) btn.click();
      }, 500);
    };

    recognition.onerror = (e: any) => {
      setIsListening(false);
      console.error('[Voice] SpeechRecognition error:', e.error);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        addSystemMessage(
          '🎙️ Microphone blocked by browser.\\n\\n' +
          'Fix: While on this page, click the 🔒 lock icon in the address bar → Site settings → Microphone → Allow → Refresh page.'
        );
      } else if (e.error === 'network') {
        addSystemMessage('🌐 Cannot reach Google speech servers. Check your internet and try again.');
      } else if (e.error === 'audio-capture') {
        addSystemMessage('🎙️ No microphone found. Please connect a microphone and try again.');
      } else if (e.error === 'aborted') {
        // silently ignore — user stopped it
      } else if (e.error === 'no-speech') {
        addSystemMessage('🎙️ No speech detected. Try speaking louder and closer to the mic.');
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e: any) {
      console.error('[Voice] start error:', e);
    }
  };'''

new_func = '''  const startListening = async () => {
    if (isListening && recognitionRef.current) {
      if (recognitionRef.current.state === 'recording') {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsListening(false);
        setIsThinking(true);
        stream.getTracks().forEach(track => track.stop());

        try {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) throw new Error('Transcription failed');
          
          const data = await response.json();
          if (data.text && data.text.trim().length > 0) {
             setInputText(data.text);
             handleSend(data.text);
          } else {
             addSystemMessage('🎙️ No speech detected. Please try speaking closer to the microphone.');
          }
        } catch (error) {
          console.error('[Voice] Transcription error:', error);
          addSystemMessage('🎙️ Error transcribing audio. Check your GROQ_API_KEY in Vercel.');
        } finally {
          setIsThinking(false);
        }
      };

      recognitionRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
      
      // Auto-stop after 8 seconds
      setTimeout(() => {
        if (recognitionRef.current && recognitionRef.current.state === 'recording') {
          recognitionRef.current.stop();
        }
      }, 8000);

    } catch (err: any) {
      console.error('[Voice] Mic error:', err);
      addSystemMessage('🎙️ Microphone blocked. Please allow microphone access in your browser settings.');
    }
  };'''

if old_func in content:
    with open('apps/web/src/app/(app)/agent/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content.replace(old_func, new_func))
    print("Replaced successfully!")
else:
    print("Could not find exact match!")
