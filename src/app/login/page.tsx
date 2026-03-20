import { login } from '@/app/login/actions'
import Link from 'next/link'
import GoogleButton from '@/components/GoogleButton'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const resolvedParams = await searchParams
    const message = resolvedParams?.message

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
            <div className="w-full max-w-sm animate-fadeIn">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[var(--cta)] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-[var(--primary)] tracking-tight">Welcome back</h1>
                    <p className="text-sm text-[var(--secondary)] mt-1">Sign in to your Follow-Up Tracker account</p>
                </div>

                <div className="card p-6">
                    <form className="space-y-4" action={login}>
                        {message && (
                            <div className="bg-red-50 text-red-600 px-3 py-2.5 rounded-lg text-sm text-center border border-red-100">
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

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider" htmlFor="password">
                                    Password
                                </label>
                                <Link href="/forgot-password" id="forgot-password-link" className="text-[10px] font-bold text-[var(--cta)] hover:underline uppercase tracking-tight">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="input text-[var(--primary)]"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full justify-center mt-2">
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or sign in with</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <div className="mt-6">
                        <GoogleButton text="Sign in with Google" />
                    </div>
                </div>

                <p className="mt-5 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-[var(--cta)] font-medium hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    )
}
