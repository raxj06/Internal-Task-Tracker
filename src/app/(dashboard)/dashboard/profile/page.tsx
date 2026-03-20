import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: profile } = await supabase
        .from('users')
        .select('id, full_name, email, whatsapp_no, role, department')
        .eq('id', user.id)
        .single()

    if (!profile) return redirect('/dashboard')

    return (
        <div className="max-w-2xl mx-auto py-10">
            <header className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-[var(--primary)] tracking-tight">Personal Settings</h1>
                <p className="text-slate-500 mt-1">Manage your identity and contact information.</p>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8">
                <ProfileForm profile={profile} />
            </div>
        </div>
    )
}
