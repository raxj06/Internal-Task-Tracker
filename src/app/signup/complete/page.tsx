import { completeProfile } from '@/app/signup/complete/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CompleteProfilePage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const resolvedParams = await searchParams
    const message = resolvedParams?.message

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if profile exists already, in case they navigate here manually
    const { data: profile } = await supabase.from('users').select('id').eq('id', user.id).single()
    if (profile) {
        redirect('/dashboard')
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
            <div className="w-full max-w-md animate-fadeIn">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[var(--cta)] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-[var(--primary)] tracking-tight">Complete your profile</h1>
                    <p className="text-sm text-[var(--secondary)] mt-1">Almost done! Just a few more details.</p>
                </div>

                <div className="card p-6">
                    <form className="space-y-4" action={completeProfile}>
                        {message && (
                            <div className="bg-red-50 text-red-600 px-3 py-2.5 rounded-lg text-sm text-center border border-red-100">
                                {message}
                            </div>
                        )}

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
                            Finish Setup & Go to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
