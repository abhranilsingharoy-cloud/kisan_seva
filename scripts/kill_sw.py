import re

with open('apps/web/src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

script_to_add = """          <script dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `
          }} />"""

content = content.replace("</head>", script_to_add + "\n        </head>")

with open('apps/web/src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added Service Worker killer script")
