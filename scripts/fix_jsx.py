import re

with open("apps/web/src/app/(app)/resources/StorageTab.tsx", "r", encoding="utf-8") as f:
    content = f.read()

bad_jsx = """            {/* Info note */}
            {results.length > 0 && (
                              {isFallbackData && ("""

good_jsx = """            {/* Info note */}
            {results.length > 0 && (
              <>
                {isFallbackData && ("""

content = content.replace(bad_jsx, good_jsx)

bad_end = """                </p>
              </div>
            )}
          </>
        )}"""

good_end = """                </p>
              </div>
              </>
            )}
          </>
        )}"""

content = content.replace(bad_end, good_end)

with open("apps/web/src/app/(app)/resources/StorageTab.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("JSX Fixed")
