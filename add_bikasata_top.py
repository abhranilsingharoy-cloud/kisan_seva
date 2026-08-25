with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Add it under the main title as a subtitle
if "## 🌟 Why KisanSeva?" in content:
    content = content.replace("## 🌟 Why KisanSeva?", "> **Empowering farmers to build a Bikasata Bharat (Developed India)** 🇮🇳\n\n## 🌟 Why KisanSeva?")

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added subtitle successfully")
