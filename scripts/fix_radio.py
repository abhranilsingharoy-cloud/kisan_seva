import re

with open('apps/web/src/app/(app)/community/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    const playStation = (station: typeof STATIONS[0]) => {
      if (audioRef.current) { 
        audioRef.current.oncanplay = null;
        audioRef.current.onerror = null;
        audioRef.current.pause(); 
        audioRef.current.removeAttribute('src'); 
        audioRef.current.load();
        audioRef.current = null;
      }

      if (activeId === station.id) { 
        setActiveId(null); 
        setStatusMap(prev => ({ ...prev, [station.id]: 'idle' }));
        return; 
      }

      setActiveId(station.id);
      setStatus(station.id, 'loading');
  
      const audio = new Audio();
      audio.volume = muted ? 0 : volume / 100;
      audio.preload = 'none';
      
      audio.oncanplay = () => {
        if (audioRef.current === audio) {
          setStatus(station.id, 'playing');
          audio.play().catch(() => setStatus(station.id, 'error'));
        }
      };
      
      audio.onerror = () => {
        if (audioRef.current === audio) {
          if (audio.src !== station.fallbackUrl) { 
            audio.src = station.fallbackUrl; 
            audio.load(); 
          } else { 
            setStatus(station.id, 'error'); 
            setActiveId(null); 
          }
        }
      };
      
      audio.src = station.streamUrl;
      audio.load();
      audioRef.current = audio;
    };"""

content = re.sub(
    r'    const playStation = \(station: typeof STATIONS\[0\]\) => \{.*?audioRef\.current = audio;\n    \};',
    replacement,
    content,
    flags=re.DOTALL
)

with open('apps/web/src/app/(app)/community/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced playStation logic")
