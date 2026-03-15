'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeProfile(formData: FormData) {
    const role = formData.get('role') as string
    const department = formData.get('department') as string
    const orgName = formData.get('orgName') as string

    const supabase = await createClient()

    // Ensure user is authenticated from Google
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login?message=Authentication required')
    }

    // 1. Find or create the Organisation
    let orgId: string

    const { data: existingOrg } = await supabase
        .from('organisations')
        .select('id')
        .eq('name', orgName)
        .single()

    if (existingOrg) {
        orgId = existingOrg.id
    } else {
        const { data: newOrg, error: orgError } = await supabase
            .from('organisations')
            .insert([{ name: orgName }])
            .select()
            .single()

        if (orgError) {
            console.error('Failed to create org', orgError)
            return redirect('/signup/complete?message=Failed to setup organization')
        }
        orgId = newOrg.id
    }

    // 2. Create the public user profile profile with the department
    const { error: profileError } = await supabase
        .from('users')
        .insert([{
            id: user.id,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Google User',
            email: user.email,
            role,
            department,
            org_id: orgId
        }])

    if (profileError) {
        console.error('Failed to create profile', profileError)
        return redirect('/signup/complete?message=Could not complete user profile')
    }

    // 3. Setup complete, redirect to dashboard
    return redirect('/dashboard')
}
