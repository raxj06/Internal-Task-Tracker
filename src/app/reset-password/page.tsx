import { updatePassword } from '@/app/login/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // If no user, they shouldn't be here (link invalid or expired)
    if (!user) {
        return redirect('/login?message=Reset link expired or invalid')
    }

    const resolvedParams = await searchParams
    const message = resolvedParams?.message

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
            <div className="w-full max-w-sm animate-fadeIn">
                <div className="text-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[var(--cta)] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-[var(--primary)] tracking-tight">Set new password</h1>
                    <p className="text-sm text-[var(--secondary)] mt-1">Enter your new password below.</p>
                </div>

                <div className="card p-6">
                    <form className="space-y-4" action={updatePassword}>
                        {message && (
                            <div className="bg-red-50 text-red-600 px-3 py-2.5 rounded-lg text-sm text-center border border-red-100">
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="password">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="input text-[var(--primary)]"
                                minLength={6}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full justify-center mt-2">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
