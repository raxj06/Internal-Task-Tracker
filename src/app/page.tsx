import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--cta)] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-bold text-[var(--primary)] tracking-tight">Follow-Up Tracker</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-[var(--secondary)] hover:text-[var(--primary)] transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary text-sm px-4 py-2">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center py-20 md:py-28 animate-slideUp">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[var(--cta)] text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cta)] animate-pulse" />
            Internal Task Management
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--primary)] mb-5 tracking-tight leading-[1.1]">
            Accountability,<br />Automated.
          </h1>
          <p className="text-lg text-[var(--secondary)] max-w-xl mx-auto mb-10 leading-relaxed">
            The autonomous reminder and task exchange system. Reduce communication overhead and enforce accountability across your organization.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">
              Start Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/login" className="btn-secondary px-6 py-3 text-base">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 pb-20">
          {[
            {
              icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
              title: 'Automated Follow-ups',
              desc: 'Set the schedule. We handle Email and WhatsApp reminders automatically via n8n webhooks.',
            },
            {
              icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
              title: 'Role-Based Views',
              desc: 'Founders, Managers, and Employees each get exactly the context and controls they need.',
            },
            {
              icon: 'M13 10V3L4 14h7v7l9-11h-7z',
              title: 'Instant Escalation',
              desc: 'When a task gets blocked, managers are alerted in real-time. No stalled progress.',
            },
          ].map((feature, i) => (
            <div key={i} className="card animate-slideUp" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[var(--cta)] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[var(--primary)] mb-1.5">{feature.title}</h3>
              <p className="text-sm text-[var(--secondary)] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          © 2026 Follow-Up Tracker by Joyspoon. Built with Next.js + Supabase.
        </div>
      </footer>
    </div>
  )
}
