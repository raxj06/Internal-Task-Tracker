'use client'

import { updateTaskStatus } from '@/app/actions/tasks'
import { useState } from 'react'
import TaskDetailModal from './TaskDetailModal'

type Task = {
    id: string
    title: string
    description: string | null
    priority: string
    status: string
    due_date: string | null
    assignee: { full_name: string } | null
    creator: { full_name: string } | null
}

export default function TaskCard({ task, isAssignee = false }: { task: Task, isAssignee?: boolean }) {
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const priorityColors: Record<string, string> = {
        'High': 'bg-red-100 text-red-800',
        'Medium': 'bg-orange-100 text-orange-800',
        'Low': 'bg-green-100 text-green-800'
    }

    const statusColors: Record<string, string> = {
        'Not Started': 'bg-slate-100 text-slate-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-emerald-100 text-emerald-800',
        'Blocked': 'bg-red-100 text-red-800'
    }

    async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setIsUpdating(true)
        await updateTaskStatus(task.id, e.target.value)
        setIsUpdating(false)
    }

    return (
        <>
            <div className="card transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[var(--primary)] text-lg">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                </div>

                {task.description && (
                    <p className="text-sm text-[var(--secondary)] mb-4 line-clamp-2">
                        {task.description}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-[var(--secondary)] mb-4">
                    <div>
                        <span className="block font-medium text-slate-500">Assignee</span>
                        {task.assignee?.full_name || 'Unassigned'}
                    </div>
                    <div>
                        <span className="block font-medium text-slate-500">Creator</span>
                        {task.creator?.full_name || 'System'}
                    </div>
                    <div>
                        <span className="block font-medium text-slate-500">Due Date</span>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        {isAssignee ? (
                            <select
                                className={`text-xs border-0 rounded-full px-2 py-1 font-medium cursor-pointer focus:ring-2 focus:ring-slate-200 outline-none ${statusColors[task.status]}`}
                                defaultValue={task.status}
                                onChange={handleStatusChange}
                                disabled={isUpdating}
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Blocked">Blocked</option>
                                <option value="Completed">Completed</option>
                            </select>
                        ) : (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
                                {task.status}
                            </span>
                        )}
                        {isUpdating && <span className="text-xs text-slate-400">Saving...</span>}
                    </div>

                    <button
                        onClick={() => setIsDetailOpen(true)}
                        className="text-xs font-medium text-[var(--cta)] hover:underline"
                    >
                        View Details
                    </button>
                </div>
            </div>

            <TaskDetailModal
                task={task}
                isAssignee={isAssignee}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />
        </>
    )
}
