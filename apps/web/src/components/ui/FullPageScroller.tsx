'use client'
// Copied from JanSuvidha FullPageScroller — same scroll-snap architecture
export default function FullPageScroller({ children }: { children: React.ReactNode }) {
  const sections = Array.isArray(children) ? children : [children]
  return (
    <div className="snap-container">
      {sections.map((section, i) => (
        <section key={i} className="snap-section w-full flex flex-col justify-center">
          {section}
        </section>
      ))}
    </div>
  )
}
