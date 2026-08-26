import re

with open('apps/web/src/app/(app)/community/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """  useEffect(() => {
    return () => {
      if (audioRef.current) { 
        audioRef.current.oncanplay = null;
        audioRef.current.onerror = null;
        audioRef.current.pause(); 
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
    };
  }, []);"""

content = re.sub(
    r'  useEffect\(\(\) => \{\n    return \(\) => \{\n      if \(audioRef\.current\) \{ audioRef\.current\.pause\(\); audioRef\.current\.src = \'\'; \}\n    \};\n  \}, \[\]\);',
    replacement,
    content,
    flags=re.DOTALL
)

with open('apps/web/src/app/(app)/community/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced useEffect logic")
