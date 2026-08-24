import re

with open('apps/web/src/app/(app)/agent/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('<textarea\n                ref={textareaRef}')
end_idx = content.find('</button>\n              </div>\n            </div>\n\n            <p')

if start_idx != -1 and end_idx != -1:
    end_idx += len('</button>\n              </div>')
    
    new_jsx = """<textarea
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
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-red-200 scale-105' 
                      : 'bg-[#e5f5e0] hover:bg-[#c7e9c0] text-[#2ca25f]'
                  }`}
                  title="Tap to speak"
                >
                  {isListening ? <Square size={16} className="fill-current"/> : <Mic size={18}/>}
                </button>
                
                <button
                  id="send-message-btn"
                  onClick={() => handleSend()}
                  disabled={(!inputText.trim() && !isThinking) || isListening}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0 ${
                    inputText.trim() && !isThinking
                      ? 'bg-slate-700 hover:bg-slate-800 text-white'
                      : isThinking
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-slate-400 text-white opacity-80 cursor-not-allowed'
                  }`}
                >
                  {isThinking ? <Loader2 size={18} className="animate-spin"/> : <Send size={16} className="ml-0.5"/>}
                </button>
              </div>"""

    new_content = content[:start_idx] + new_jsx + content[end_idx:]
    with open('apps/web/src/app/(app)/agent/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed perfectly!")
else:
    print("Could not find bounds!")
