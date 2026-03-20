import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DepartmentManager from '@/components/DepartmentManager'
import TeamManager from '@/components/TeamManager'

export default async function SettingsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: profile } = await supabase
        .from('users')
        .select('org_id, role')
        .eq('id', user.id)
        .single()

    if (!profile || (profile.role !== 'Founder' && profile.role !== 'Admin')) {
        return redirect('/dashboard')
    }

    const { data: org } = await supabase
        .from('organisations')
        .select('id, name, departments')
        .eq('id', profile.org_id)
        .single()

    const { data: teamMembers } = await supabase
        .from('users')
        .select('id, full_name, email, role, department, whatsapp_no')
        .eq('org_id', profile.org_id)
        .order('full_name')

    // Default departments if list is null
    const departments = org?.departments || ['Sales', 'Marketing']

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <header>
                <h1 className="text-3xl font-bold text-[var(--primary)] tracking-tight">Organization Settings</h1>
                <p className="text-slate-500 mt-1">Manage your company structure and team members.</p>
            </header>

            <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Departments</h2>
                    <p className="text-xs text-slate-500">Add or remove departments within {org?.name}.</p>
                </div>
                <div className="p-6">
                    <DepartmentManager orgId={org?.id || ''} initialDepartments={departments} />
                </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Team Members</h2>
                    <p className="text-xs text-slate-500">Manage role and department assignments for your team.</p>
                </div>
                <div className="overflow-x-auto">
                    <TeamManager 
                        members={teamMembers || []} 
                        departments={departments}
                        currentUserId={user.id} 
                    />
                </div>
            </section>
        </div>
    )
}
