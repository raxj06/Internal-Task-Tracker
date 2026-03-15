'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

/**
 * Subscribes to Supabase Realtime changes on the `tasks` table.
 * Automatically refreshes the page data when a task is inserted, updated, or deleted.
 */
export default function RealtimeListener({ orgId }: { orgId: string }) {
    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel('realtime-tasks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                    filter: `org_id=eq.${orgId}`,
                },
                () => {
                    // Refresh server components when any task changes
                    router.refresh()
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                },
                () => {
                    router.refresh()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [orgId, router])

    // This component renders nothing — it's purely a side-effect listener
    return null
}
