'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function SeedPage() {
    const [status, setStatus] = useState('Idle')
    const supabase = createClient()

    async function handleSeed() {
        setStatus('Seeding...')

        // 1. Create Default Org
        const { data: org, error: orgError } = await supabase
            .from('organisations')
            .insert([{ name: 'Joyspoon HQ' }])
            .select()
            .single()

        if (orgError) {
            console.error('Org error', orgError)
            setStatus(`Failed creating org: ${orgError.message}`)
            return
        }

        const usersToCreate = [
            { email: 'founder@tester.com', password: 'password123', name: 'Alice Founder', role: 'Founder' },
            { email: 'manager@tester.com', password: 'password123', name: 'Bob Manager', role: 'Manager' },
            { email: 'employee@tester.com', password: 'password123', name: 'Charlie Employee', role: 'Employee' }
        ]

        for (const u of usersToCreate) {
            // Create user via auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: u.email,
                password: u.password,
            })

            if (authError) {
                console.error(authError)
                continue
            }

            const userId = authData.user?.id
            if (userId) {
                // Create in public.users
                await supabase
                    .from('users')
                    .insert([{
                        id: userId,
                        full_name: u.name,
                        email: u.email,
                        role: u.role,
                        org_id: org.id
                    }])
            }
        }

        setStatus('Done! Users created: founder@tester.com, manager@tester.com, employee@tester.com / password123')
    }

    return (
        <div className="min-h-screen p-8 content-center">
            <div className="card max-w-lg mx-auto text-center space-y-4">
                <h1 className="text-xl font-bold">Dev Seeder</h1>
                <p className="text-sm text-slate-500">Run this once to create the default test users.</p>
                <button onClick={handleSeed} className="btn-primary w-full">
                    Seed Database
                </button>
                <div className="text-sm p-4 bg-slate-100 rounded">
                    Status: {status}
                </div>
            </div>
        </div>
    )
}
