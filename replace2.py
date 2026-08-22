import re

with open('apps/web/src/app/(app)/agent/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

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

# Find the start and end of startListening
start_idx = content.find('  const startListening = () => {')
end_idx = content.find('  const speakResponse = (text: string, langCode: string) => {')

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_func + '\n\n' + content[end_idx:]
    with open('apps/web/src/app/(app)/agent/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced successfully via substring!")
else:
    print("Could not find bounds!")
