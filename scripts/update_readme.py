import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """### 👥 15. Community Hub (Kisan Sabha)
- **🚨 SOS Emergency Broadcast** — alert nearby farmers about locust attacks, flash floods, disease outbreaks
- **🗣️ Kisan Sabha Forum** — community discussions, traditional knowledge sharing
- **Farmer-to-Farmer messaging** — connect with farmers in your district
- **Local agricultural news feed**

---

### 📡 16. Smart IoT Integration
> *Connect hardware sensors directly to your dashboard*
- **Real-Time Telemetry** — monitor soil moisture, temperature, NPK sensors
- **Live Charts** — animated area charts for sensor trends over time
- **Automated Threshold Alerts** — triggers push notifications if moisture drops below 30%

---

### 🔔 17. Intelligent Notification System
> *Never miss an important farm update*
- **Push Notifications** — weather alerts, market price targets, and community SOS
- **Live Krishi News** — fetches real-time agricultural news from Google News RSS
- **Background Sync** — works via Service Workers even when the app is closed

---

### ⚙️ 18. Settings & Offline Mode
> *Customized for the rural Indian context*
- **Multilingual Profile** — save your primary crop, farm size, and preferred language
- **Offline PWA Engine** — caches the entire app shell and Disease Library for field use with zero internet
- **Help & Support Module** — 24/7 access to Kisan Call Center (1551) integration

---"""

content = re.sub(
    r'### 👥 15\. Community Hub.*?---',
    replacement,
    content,
    flags=re.DOTALL
)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("README updated successfully")
