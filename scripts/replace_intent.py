import re

with open('apps/web/src/app/(app)/agent/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = '''  const detectIntent = (q: string) => {
    const lower = q.toLowerCase();
    if (/tomato|brown|spot|disease|blight|leaf|fungi|rot/.test(lower)) {
      return {
        routedAgents: ['Diagnosis Agent', 'Knowledge Base'],
        type: 'diagnosis' as MessageType,
        agentLabel: 'Diagnosis Agent',
        agentIcon: <Activity size={13}/>,
        data: {
          disease: 'Early Blight (Alternaria Solani)', crop: 'Tomato', confidence: 91, severity: 'Moderate',
          treatment: [
            'Remove and destroy infected lower leaves immediately.',
            'Apply Mancozeb 75 WP @ 2.5 g/litre as foliar spray.',
            'Avoid overhead irrigation \u2014 keep foliage dry.',
            'Follow up with Copper Oxychloride after 7 days.',
          ],
          organic: 'Neem oil 5 ml/litre or Bacillus subtilis spray every 7 days.',
        },
      };
    }
    if (/price|mandi|onion|bhav|market|sell|rate/.test(lower)) {
      return {
        routedAgents: ['Market Agent'],
        type: 'price' as MessageType,
        agentLabel: 'Market Agent',
        agentIcon: <TrendingUp size={13}/>,
        data: {
          bestMarket: 'Azadpur Delhi', bestPrice: '₹12,340', unit: 'qtl',
          mandis: [
            { name: 'Azadpur Delhi', price: '₹12,340', delta: '+45', trend: 'up'   },
            { name: 'Lasalgaon, MH', price: '₹12,100', delta: '-10', trend: 'down' },
            { name: 'Pune APMC',     price: '₹12,250', delta: '+20', trend: 'up'   },
          ],
        },
      };
    }
    if (/water|irrigation|wheat|paani|sinchayee|moisture/.test(lower)) {
      return {
        routedAgents: ['Weather Agent', 'Soil Health Agent'],
        type: 'weather' as MessageType,
        agentLabel: 'Weather + Soil Agent',
        agentIcon: <CloudSun size={13}/>,
        data: {
          recommendation: 'Irrigate 28 mm today',
          summary: 'Hot and dry \u2014 soil moisture at root zone is 42%. No rain forecast for 3 days.',
          forecast: [
            { day: 'Today', temp: '34°', icon: '☀️' },
            { day: 'Tomorrow', temp: '36°', icon: '🌩️' },
            { day: 'Wed', temp: '33°', icon: '⛅' },
          ],
        },
      };
    }
    return {
      routedAgents: ['Knowledge Base', 'Master Orchestrator'],
      type: 'text' as MessageType,
      agentLabel: 'KisanSeva AI',
      agentIcon: <Brain size={13}/>,
      data: null,
    };
  };'''

new_func = '''  const detectIntent = (q: string) => {
    const lower = q.toLowerCase();
    if (/tomato|brown|spot|disease|blight|leaf|fungi|rot/.test(lower)) {
      return {
        routedAgents: ['Diagnosis Agent', 'Knowledge Base'],
        type: 'diagnosis' as MessageType,
        agentLabel: 'Diagnosis Agent',
        agentIcon: <Activity size={13}/>,
        data: null,
      };
    }
    if (/price|mandi|onion|bhav|market|sell|rate/.test(lower)) {
      return {
        routedAgents: ['Market Agent'],
        type: 'price' as MessageType,
        agentLabel: 'Market Agent',
        agentIcon: <TrendingUp size={13}/>,
        data: null,
      };
    }
    if (/water|irrigation|wheat|paani|sinchayee|moisture/.test(lower)) {
      return {
        routedAgents: ['Weather Agent', 'Soil Health Agent'],
        type: 'weather' as MessageType,
        agentLabel: 'Weather + Soil Agent',
        agentIcon: <CloudSun size={13}/>,
        data: null,
      };
    }
    return {
      routedAgents: ['Knowledge Base', 'Master Orchestrator'],
      type: 'text' as MessageType,
      agentLabel: 'KisanSeva AI',
      agentIcon: <Brain size={13}/>,
      data: null,
    };
  };'''

if old_func in content:
    with open('apps/web/src/app/(app)/agent/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content.replace(old_func, new_func))
    print("Replaced properly")
else:
    print("Not found precisely. Let's do a substring find.")
    start_idx = content.find('const detectIntent = (q: string) => {')
    end_idx = content.find('const startListening = async () => {', start_idx)
    if start_idx != -1 and end_idx != -1:
        end_idx -= 4
        new_content = content[:start_idx] + new_func + content[end_idx:]
        with open('apps/web/src/app/(app)/agent/page.tsx', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Replaced via substring bounds")
    else:
        print("Failed totally")
