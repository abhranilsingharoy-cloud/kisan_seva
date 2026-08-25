with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the text
content = content.replace("## 🎥 Live Demo Video", "## 🎥 KisanSeva Vision Trailer")
content = content.replace("Watch the full 5-minute walkthrough of the KisanSeva platform in action:", "Watch our short concept trailer introducing the vision behind KisanSeva:")
content = content.replace("[**▶️ Watch the Platform Walkthrough Video**]", "[**▶️ Watch the Project Trailer**]")

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated video text successfully")
