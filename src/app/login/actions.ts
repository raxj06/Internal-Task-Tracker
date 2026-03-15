'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?message=Could not authenticate user')
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Role is no longer needed for routing, the unified dashboard handles rendering
    if (user) {
        return redirect('/dashboard')
    }

    return redirect('/login')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
}

export async function signup(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as string
    const department = formData.get('department') as string
    const orgName = formData.get('orgName') as string

    const supabase = await createClient()

    // 1. Sign up the user (Database trigger will auto-confirm the email)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (signUpError) {
        return redirect(`/signup?message=${encodeURIComponent(signUpError.message)}`)
    }

    // 2. Sign the user in immediately to establish the session cookie
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        return redirect(`/login?message=Account created! Please log in.`)
    }

    const user = signUpData.user
    if (user) {
        // 3. Find or create the Organisation
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
                return redirect('/login?message=Failed to setup organization')
            }
            orgId = newOrg.id
        }

        // 4. Create the public user profile profile with the department
        const { error: profileError } = await supabase
            .from('users')
            .insert([{
                id: user.id,
                full_name: fullName,
                email,
                role,
                department,
                org_id: orgId
            }])

        if (profileError) {
            console.error('Failed to create profile', profileError)
            return redirect('/login?message=Could not build user profile')
        }
    }

    return redirect('/dashboard')
}
