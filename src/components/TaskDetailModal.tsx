'use client'

import { useState, useEffect, useTransition } from 'react'
import { addComment, getComments, updateTaskStatus } from '@/app/actions/tasks'

type Comment = {
    id: string
    body: string
    created_at: string
    user: { full_name: string } | null
}

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

export default function TaskDetailModal({
    task,
    isAssignee,
    isOpen,
    onClose,
}: {
    task: Task
    isAssignee: boolean
    isOpen: boolean
    onClose: () => void
}) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [isPending, startTransition] = useTransition()
    const [isLoadingComments, setIsLoadingComments] = useState(false)

    useEffect(() => {
        if (isOpen) {
            loadComments()
        }
    }, [isOpen, task.id])

    async function loadComments() {
        setIsLoadingComments(true)
        const data = await getComments(task.id)
        setComments(data as unknown as Comment[])
        setIsLoadingComments(false)
    }

    function handleAddComment() {
        if (!newComment.trim()) return
        startTransition(async () => {
            await addComment(task.id, newComment.trim())
            setNewComment('')
            await loadComments()
        })
    }

    function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        startTransition(async () => {
            await updateTaskStatus(task.id, e.target.value)
        })
    }

    if (!isOpen) return null

    const priorityColors: Record<string, string> = {
        'High': 'bg-red-100 text-red-800',
        'Medium': 'bg-orange-100 text-orange-800',
        'Low': 'bg-green-100 text-green-800',
    }

    const statusColors: Record<string, string> = {
        'Not Started': 'bg-slate-100 text-slate-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-emerald-100 text-emerald-800',
        'Blocked': 'bg-red-100 text-red-800',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-fadeIn mx-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 mr-4">
                            <h2 className="text-xl font-bold text-[var(--primary)]">{task.title}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                </span>
                                {isAssignee ? (
                                    <select
                                        className={`text-xs border-0 rounded-full px-2 py-1 font-medium cursor-pointer focus:ring-2 focus:ring-slate-200 outline-none ${statusColors[task.status]}`}
                                        defaultValue={task.status}
                                        onChange={handleStatusChange}
                                        disabled={isPending}
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
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Task Details */}
                    {task.description && (
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-sm text-[var(--primary)] leading-relaxed">{task.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                        <div>
                            <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Assignee</span>
                            <span className="text-[var(--primary)] font-medium">{task.assignee?.full_name || 'Unassigned'}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Created by</span>
                            <span className="text-[var(--primary)] font-medium">{task.creator?.full_name || 'System'}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Due Date</span>
                            <span className="text-[var(--primary)] font-medium">
                                {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}
                            </span>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-slate-100 pt-5">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                            Comments & Updates
                        </h3>

                        {isLoadingComments ? (
                            <div className="text-center py-6 text-sm text-slate-400">Loading comments...</div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-6 text-sm text-slate-400">
                                No comments yet. Be the first to add an update!
                            </div>
                        ) : (
                            <div className="space-y-3 mb-4 max-h-[30vh] overflow-y-auto">
                                {comments.map(comment => (
                                    <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-semibold text-[var(--primary)]">
                                                {comment.user?.full_name || 'Unknown'}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(comment.created_at).toLocaleDateString('en-US', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed">{comment.body}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Comment Input - Fixed at Bottom */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white rounded-b-xl">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add a comment or update..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleAddComment() }}
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400 transition-all"
                            disabled={isPending}
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={isPending || !newComment.trim()}
                            className="px-5 py-2.5 bg-[var(--cta)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
