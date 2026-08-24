import re

with open('apps/web/src/app/(app)/agent/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('<textarea')
end_idx = content.find('</button>\n                )}', start_idx)

if start_idx != -1 and end_idx != -1:
    end_idx += len('</button>\n                )}')
    
    new_jsx = '''<textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder="Type or click mic to speak..."
                className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 leading-relaxed py-2 ml-1"
                rows={1}
                style={{ maxHeight: '128px' }}
              />

              <div className="shrink-0 flex items-center gap-2 mb-0.5">
                <button 
                  onClick={startListening}
                  className={w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm }
                  title="Tap to speak"
                >
                  {isListening ? <Square size={16} className="fill-current"/> : <Mic size={18}/>}
                </button>
                
                <button
                  id="send-message-btn"
                  onClick={() => handleSend()}
                  disabled={(!inputText.trim() && !isThinking) || isListening}
                  className={w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0 }
                >
                  {isThinking ? <Loader2 size={18} className="animate-spin"/> : <Send size={16} className="ml-0.5"/>}
                </button>'''

    new_content = content[:start_idx] + new_jsx + content[end_idx:]
    with open('apps/web/src/app/(app)/agent/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced perfectly via bounds!")
else:
    print("Could not find bounds!")
