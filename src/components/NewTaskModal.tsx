'use client'

import { createTask } from '@/app/actions/tasks'
import { useState, useRef } from 'react'
import { X } from 'lucide-react'

type User = {
    id: string
    full_name: string
    role: string
    department: string | null
}

export default function NewTaskModal({ subordinates, onClose }: { subordinates: User[], onClose: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        await createTask(formData)
        setIsSubmitting(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[var(--primary)]">Create New Task</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form ref={formRef} action={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--primary)] mb-1" htmlFor="title">
                            Task Title
                        </label>
                        <input
                            id="title" name="title" type="text"
                            placeholder="e.g. Review Q3 Sales Report"
                            className="input w-full" required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--primary)] mb-1" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description" name="description"
                            placeholder="Provide details about the task..."
                            className="input w-full h-24 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary)] mb-1" htmlFor="assignee_id">
                                Assignee
                            </label>
                            <select id="assignee_id" name="assignee_id" className="input w-full bg-white" required>
                                <option value="">Select team member...</option>
                                {subordinates.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.full_name} ({sub.department || sub.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--primary)] mb-1" htmlFor="due_date">
                                Due Date
                            </label>
                            <input
                                id="due_date" name="due_date" type="date"
                                className="input w-full bg-white" required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--primary)] mb-1" htmlFor="priority">
                            Priority
                        </label>
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" value="Low" className="text-green-600 focus:ring-green-600" />
                                <span className="text-sm">Low</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" value="Medium" defaultChecked className="text-orange-600 focus:ring-orange-600" />
                                <span className="text-sm">Medium</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" value="High" className="text-red-600 focus:ring-red-600" />
                                <span className="text-sm">High</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary shadow-sm"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
