import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-canvas flex flex-col overflow-x-clip">
      {/* Same soft brand glow + fading grid as the landing hero, toned down */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[420px]
        bg-[radial-gradient(60%_60%_at_50%_0%,rgb(30_76_224/0.08),transparent_75%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[360px]
        bg-[linear-gradient(to_right,var(--tb-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--tb-line)_1px,transparent_1px)]
        bg-[size:56px_56px] opacity-40
        [mask-image:radial-gradient(60%_70%_at_50%_0%,black,transparent_80%)]" />
      <Navbar />
      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10
        animate-fade-up">
        {children}
      </main>
      <Footer />
    </div>
  )
}
