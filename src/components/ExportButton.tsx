'use client'

import { Download } from 'lucide-react'

interface Task {
    id: string
    title: string
    description?: string | null
    priority: string
    status: string
    due_date?: string | null
    assignee?: { full_name: string } | null
    creator?: { full_name: string } | null
}

export default function ExportButton({ tasks, filename = 'tasks-export.csv' }: { tasks: Task[], filename?: string }) {
    function convertToCSV() {
        if (!tasks || tasks.length === 0) return

        const headers = ['Title', 'Description', 'Priority', 'Status', 'Due Date', 'Assignee', 'Creator']
        const rows = tasks.map(t => [
            t.title,
            (t.description || '').replace(/,/g, ';'), // simple csv sanitization
            t.priority,
            t.status,
            t.due_date ? new Date(t.due_date).toLocaleDateString() : 'N/A',
            t.assignee?.full_name || 'N/A',
            t.creator?.full_name || 'N/A'
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <button 
            onClick={convertToCSV}
            className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-slate-500 hover:text-[var(--cta)] hover:bg-slate-50 rounded-lg transition-all uppercase tracking-widest border border-slate-200"
        >
            <Download size={14} />
            Export CSV
        </button>
    )
}
