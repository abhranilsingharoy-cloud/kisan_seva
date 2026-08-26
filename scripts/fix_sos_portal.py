import re

with open('apps/web/src/components/CommunitySOS.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix: check if ReactDOM portal is already there
if 'createPortal' not in content:
    # Add createPortal import
    content = content.replace(
        "import React, { useState, useEffect, useRef } from 'react';",
        "import React, { useState, useEffect, useRef } from 'react';\nimport { createPortal } from 'react-dom';"
    )

    # Wrap the return() in a portal for everything after 'if (!mounted) return null;'
    # The component currently returns: <> <style>...</style> <div alerts> <div button> <div modal> </>
    # We need to wrap in createPortal so it escapes the DOM hierarchy

    content = content.replace(
        'if (!mounted) return null;\n\n  return (',
        'if (!mounted) return null;\n\n  return createPortal('
    )
    # Close the portal call - find the last );  at the end and change to ), document.body);
    # Find the last ); in the file
    last_closing = content.rfind('\n  );\n}\n')
    if last_closing != -1:
        content = content[:last_closing] + '\n  , document.body);\n}\n'

with open('apps/web/src/components/CommunitySOS.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added createPortal to CommunitySOS")
print("createPortal" in open('apps/web/src/components/CommunitySOS.tsx', 'r', encoding='utf-8').read())
