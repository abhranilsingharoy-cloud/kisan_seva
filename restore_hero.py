import re

with open('apps/web/src/app/(marketing)/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.08] mb-6">
            Empower your farm, <br /> grow your future
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed mb-9">
            Track prices, get weather updates, and manage crops all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/market"
              className="w-full sm:w-auto bg-transparent text-[#2A854B] font-medium px-8 py-3.5 rounded-full border border-[#2A854B] hover:bg-[#e7f4ec] transition-all text-base shadow-sm"
            >
              Monitor Prices
            </Link>
            <Link
              href="/schedule"
              className="w-full sm:w-auto bg-[#2A854B] hover:bg-[#226b3c] text-white font-medium px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all text-base"
            >
              Check Weather
            </Link>
          </div>"""

content = re.sub(
    r'          {/\* SIH Badge \*/}.*?View Dashboard\n            </Link>\n          </div>',
    replacement,
    content,
    flags=re.DOTALL
)

with open('apps/web/src/app/(marketing)/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Restored original hero section")
