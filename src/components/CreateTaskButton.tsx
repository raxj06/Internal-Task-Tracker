'use client'

import { useState } from 'react'
import NewTaskModal from './NewTaskModal'

type User = {
    id: string
    full_name: string
    role: string
    department: string | null
}

export default function CreateTaskButton({ subordinates }: { subordinates: User[] }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="btn-primary text-sm px-4 py-2 shadow-sm">
                + New Task
            </button>

            {isOpen && (
                <NewTaskModal subordinates={subordinates} onClose={() => setIsOpen(false)} />
            )}
        </>
    )
}
