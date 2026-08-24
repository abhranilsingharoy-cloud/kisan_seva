import re

with open('apps/web/src/app/(app)/agent/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Strip all fake data injection from detectIntent
new_detect = '''  const detectIntent = (q: string) => {
    const lower = q.toLowerCase();
    if (/tomato|brown|spot|disease|blight|leaf|fungi|rot/.test(lower)) {
      return { routedAgents: ['Diagnosis Agent', 'Knowledge Base'], type: 'diagnosis' as MessageType, agentLabel: 'Diagnosis Agent', agentIcon: <Activity size={13}/>, data: null };
    }
    if (/price|mandi|onion|bhav|market|sell|rate/.test(lower)) {
      return { routedAgents: ['Market Agent'], type: 'price' as MessageType, agentLabel: 'Market Agent', agentIcon: <TrendingUp size={13}/>, data: null };
    }
    if (/water|irrigation|wheat|paani|sinchayee|moisture/.test(lower)) {
      return { routedAgents: ['Weather Agent', 'Soil Health Agent'], type: 'weather' as MessageType, agentLabel: 'Weather + Soil Agent', agentIcon: <CloudSun size={13}/>, data: null };
    }
    return { routedAgents: ['Knowledge Base', 'Master Orchestrator'], type: 'text' as MessageType, agentLabel: 'KisanSeva AI', agentIcon: <Brain size={13}/>, data: null };
  };'''

start_detect = content.find('const detectIntent = (q: string) => {')
end_detect = content.find('  const handleSend = async', start_detect)

if start_detect != -1 and end_detect != -1:
    # Also find where responseText is assigned
    content = content[:start_detect] + new_detect + '\n\n' + content[end_detect:]
    
    # Update responseText fallback logic to not rely on intent.data
    old_fallback = '''    const responseText = intent.data
      ? (apiResult?.result?.text ?? 'Analysis complete. See details below.')
      : (apiResult?.result?.text ?? 'Based on agricultural best practices, monitor your field and maintain optimal irrigation schedules.');'''
      
    new_fallback = '''    const responseText = apiResult?.result?.text || 'I am sorry, but I am unable to connect to the server right now. Please try again.';'''
    
    content = content.replace(old_fallback, new_fallback)
    
    # Also do it for voice transcript logic
    old_voice_fallback = '''          const responseText = intent.data
            ? (apiResult?.result?.text ?? 'Analysis complete. See details below.')
            : (apiResult?.result?.text ?? 'Based on agricultural best practices, monitor your field and maintain optimal irrigation schedules.');'''
    new_voice_fallback = '''          const responseText = apiResult?.result?.text || 'I am sorry, but I am unable to connect to the server right now. Please try again.';'''
    
    content = content.replace(old_voice_fallback, new_voice_fallback)
    
    with open('apps/web/src/app/(app)/agent/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced logic successfully!")
else:
    print("Could not find detectIntent block bounds")
