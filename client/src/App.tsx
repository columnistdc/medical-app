import { useState } from 'react'
import reactLogo from './assets/react.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 pb-4 pt-10">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Vite + React</h1>
        <nav className="flex items-center gap-4">
          <a
            href="https://vite.dev"
            target="_blank"
            className="text-slate-300 transition hover:text-white"
          >
            Vite
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            className="text-slate-300 transition hover:text-white"
          >
            React
          </a>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6">
        <div className="flex items-center justify-center gap-10 md:gap-14">
          <a
            href="https://vite.dev"
            target="_blank"
            className="group relative"
            aria-label="Vite website"
          ></a>
          <a
            href="https://react.dev"
            target="_blank"
            className="group relative"
            aria-label="React website"
          >
            <img
              src={reactLogo}
              alt="React logo"
              className="h-16 w-16 animate-[spin_12s_linear_infinite] drop-shadow-[0_8px_25px_rgba(56,189,248,0.45)] transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20"
            />
          </a>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-8">
          <h2 className="mb-4 text-xl font-semibold">Playground</h2>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              onClick={() => setCount(c => c + 1)}
              className="inline-flex items-center justify-center rounded-xl border-2 border-[rgba(255,165,0,0.5)] bg-white/5 px-5 py-2.5 transition will-change-transform hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              count is&nbsp;<span className="font-semibold">{count}</span>
            </button>

            <p className="text-slate-300">
              Edit{' '}
              <code className="rounded-md border border-white/10 bg-black/40 px-2 py-1">
                src/App.tsx
              </code>{' '}
              and save to test HMR
            </p>
          </div>

          <div className="mt-6 text-sm text-slate-400">Click on the logos above to learn more</div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-400">
        Crafted with Tailwind • {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App
