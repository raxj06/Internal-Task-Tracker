import { signup } from '@/app/login/actions'
import Link from 'next/link'
import GoogleButton from '@/components/GoogleButton'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const resolvedParams = await searchParams
    const message = resolvedParams?.message

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
            <div className="w-full max-w-md animate-fadeIn">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[var(--cta)] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-[var(--primary)] tracking-tight">Create your account</h1>
                    <p className="text-sm text-[var(--secondary)] mt-1">Get started with Follow-Up Tracker</p>
                </div>

                <div className="card p-6">
                    <div className="mb-6">
                        <GoogleButton text="Sign up with Google" />
                    </div>

                    <div className="mb-6 flex items-center justify-center gap-3">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or sign up with email</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <form className="space-y-4" action={signup}>
                        {message && (
                            <div className="bg-red-50 text-red-600 px-3 py-2.5 rounded-lg text-sm text-center border border-red-100">
                                {message}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="fullName">
                                    Full Name
                                </label>
                                <input id="fullName" name="fullName" type="text" placeholder="Jane Doe" className="input text-[var(--primary)]" required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="email">
                                    Email
                                </label>
                                <input id="email" name="email" type="email" placeholder="you@company.com" className="input text-[var(--primary)]" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <input id="password" name="password" type="password" placeholder="Min 6 characters" className="input text-[var(--primary)]" required minLength={6} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="role">
                                    Role
                                </label>
                                <select name="role" id="role" className="input text-[var(--primary)] bg-white" required defaultValue="Employee">
                                    <option value="Founder">Founder</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Employee">Employee</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="department">
                                    Department
                                </label>
                                <select name="department" id="department" className="input text-[var(--primary)] bg-white" required defaultValue="Sales">
                                    <option value="Sales">Sales</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Content">Content</option>
                                    <option value="E-commerce">E-commerce</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="orgName">
                                Organisation
                            </label>
                            <input id="orgName" name="orgName" type="text" placeholder="Joyspoon HQ" className="input text-[var(--primary)]" defaultValue="Joyspoon HQ" required />
                        </div>

                        <button type="submit" className="btn-primary w-full justify-center mt-2">
                            Create Account
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--cta)] font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    )
}
