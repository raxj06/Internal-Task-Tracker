import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

async function seed() {
    console.log('🌱 Seeding database...')

    // 1. Create Default Org
    const { data: org, error: orgError } = await supabaseAdmin
        .from('organisations')
        .insert([{ name: 'Joyspoon HQ' }])
        .select()
        .single()

    if (orgError) {
        console.error('Error creating org:', orgError)
        return
    }

    const orgId = org.id
    console.log(`Created Org: ${org.name} (${orgId})`)

    // 2. Define our users
    const usersToCreate = [
        { email: 'founder@tester.com', password: 'password123', name: 'Alice Founder', role: 'Founder' },
        { email: 'manager@tester.com', password: 'password123', name: 'Bob Manager', role: 'Manager' },
        { email: 'employee@tester.com', password: 'password123', name: 'Charlie Employee', role: 'Employee' }
    ]

    const createdUserIds: Record<string, string> = {}

    // 3. Create Auth Users and Public Users
    for (const u of usersToCreate) {
        // Create in auth.users
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,
        })

        if (authError) {
            console.error(`Error creating auth user ${u.email}:`, authError)
            continue
        }

        const userId = authData.user.id
        console.log(`Created Auth User: ${u.email} (${userId})`)

        // Store id for linking later
        createdUserIds[u.role] = userId

        // Create in public.users
        const { error: publicError } = await supabaseAdmin
            .from('users')
            .insert([{
                id: userId,
                full_name: u.name,
                email: u.email,
                role: u.role,
                org_id: orgId
            }])

        if (publicError) {
            console.error(`Error updating public.users for ${u.email}:`, publicError)
        }
    }

    // 4. Update Manager relationship (Set Bob as Manager for Charlie)
    if (createdUserIds['Employee'] && createdUserIds['Manager']) {
        const { error: relError } = await supabaseAdmin
            .from('users')
            .update({ manager_id: createdUserIds['Manager'] })
            .eq('id', createdUserIds['Employee'])

        if (relError) {
            console.error('Error setting manager relationship:', relError)
        } else {
            console.log('Successfully set Bob Manager as the manager for Charlie Employee')
        }
    }

    console.log('✅ Seeding complete!')
}

seed()
