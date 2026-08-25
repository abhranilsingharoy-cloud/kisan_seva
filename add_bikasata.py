with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = "Made with 🚜 • Powered by Limitless Prime • Built for Bharat"
if old_str in content:
    content = content.replace(old_str, "Made with 🚜 • Powered by AI • Built for a Bikasata Bharat (Developed India)")
else:
    # Just append it before the final </div> if exact match fails
    content = content.replace("</div>", "✨ **Contributing towards a Bikasata Bharat (Developed India)** ✨\n\n</div>")

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated README successfully")
