import re

with open('apps/web/src/app/(app)/agent/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_jsx = '''              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder="Ask in any language... (Hindi, Tamil, Telugu too)"
                className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 leading-relaxed py-1"
                rows={1}
                style={{ maxHeight: '128px' }}
              />

              <div className="shrink-0 flex items-center gap-1 mb-0.5">
                {inputText.trim() && !isThinking ? (
                  <button
                    id="send-message-btn"
                    onClick={() => handleSend()}
                    className="w-9 h-9 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                  >
                    <Send size={16} className="ml-0.5"/>
                  </button>
                ) : isThinking ? (
                  <button disabled className="w-9 h-9 rounded-xl bg-gray-200 text-gray-400 flex items-center justify-center cursor-not-allowed">
                    <Loader2 size={16} className="animate-spin"/>
                  </button>
                ) : (
                  <button 
                    onClick={startListening}
                    className={w-9 h-9 rounded-xl flex items-center justify-center transition-all }
                    title="Tap to speak"
                  >
                    <Mic size={16}/>
                  </button>
                )}
              </div>'''

new_jsx = '''              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder="Type or click mic to speak..."
                className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 leading-relaxed py-1"
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
                </button>
              </div>'''

if old_jsx in content:
    with open('apps/web/src/app/(app)/agent/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content.replace(old_jsx, new_jsx))
    print("Replaced perfectly!")
else:
    print("Not found!")
