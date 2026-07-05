import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'License Required — Lumio Search',
  description: 'This application requires a valid license key to run.',
};

export default function UnlicensedPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            License Required
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Lumio Search
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            This application is protected and requires a valid license key to operate.
            A <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-mono">LUMIO_LICENSE_KEY</code> environment variable was not found or is invalid.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* Contact section */}
        <div className="space-y-4">
          <p className="text-zinc-500 text-sm">
            To obtain a valid license key, please contact the author:
          </p>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Author</p>
                <p className="text-white text-sm font-semibold">Ma&apos;ruf Muchlisin</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Email</p>
                <a href="mailto:muchlisinmaruf@gmail.com" className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
                  muchlisinmaruf@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">GitHub</p>
                <a href="https://github.com/Mrmarc-bit" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
                  @Mrmarc-bit
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* How to use */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">After receiving your key:</p>
          <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-emerald-400 leading-relaxed">
            <span className="text-zinc-500"># Add to your .env file</span><br/>
            LUMIO_LICENSE_KEY=<span className="text-yellow-400">your-key-here</span>
          </div>
        </div>

        <p className="text-zinc-600 text-xs">
          © 2026 Lumio Search · Ma&apos;ruf Muchlisin · All Rights Reserved
        </p>
      </div>
    </div>
  );
}
