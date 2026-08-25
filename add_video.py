import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

video_section = """## 🎥 Live Demo Video

Watch the full 5-minute walkthrough of the KisanSeva platform in action:

[**▶️ Watch the Platform Walkthrough Video**](https://kisanseva-ks.vercel.app/demo-video.mp4)

---
"""

# Insert right before the final div
content = content.replace("<div align=\"center\">", video_section + "\n<div align=\"center\">")

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)
print("Video section added to README")
