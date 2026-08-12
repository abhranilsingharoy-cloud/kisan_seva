import re, base64

html = open('temp_html.txt', encoding='utf-16').read()
match = re.search(r'data:image/png;base64,([^"\'\>]+)', html)
if match:
    open('apps/web/public/hero-illustration.png', 'wb').write(base64.b64decode(match.group(1)))
    print('Image extracted successfully')
else:
    print('No image found')
