import { requestReset } from '@/app/login/actions'
import Link from 'next/link'

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const resolvedParams = await searchParams
    const message = resolvedParams?.message

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
            <div className="w-full max-w-sm animate-fadeIn">
                <div className="text-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[var(--cta)] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V7a2 2 0 00-2-2m2 2V5a2 2 0 012-2M3 13h2m6 0h8M3 17h2m3 0h12M3 21h2m3 0h12" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-[var(--primary)] tracking-tight">Forgot password?</h1>
                    <p className="text-sm text-[var(--secondary)] mt-1">Enter your email for a reset link.</p>
                </div>

                <div className="card p-6">
                    <form className="space-y-4" action={requestReset}>
                        {message && (
                            <div className="bg-sky-50 text-sky-700 px-3 py-2.5 rounded-lg text-sm text-center border border-sky-100 italic">
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@company.com"
                                className="input text-[var(--primary)]"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full justify-center mt-2">
                            Send Reset Link
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-center text-sm text-slate-400">
                    Remembered your password?{' '}
                    <Link href="/login" className="text-[var(--cta)] font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    )
}
