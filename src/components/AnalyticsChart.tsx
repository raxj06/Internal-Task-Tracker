'use client'

import { useEffect, useState } from 'react'
import { getAnalytics } from '@/app/actions/tasks'

type AnalyticsData = {
    beforeDeadline: number
    nearingDeadline: number
    afterDeadline: number
    overdue: number
    total: number
}

const SEGMENTS = [
    { key: 'beforeDeadline', label: 'Before Deadline', color: '#10B981', bg: 'bg-emerald-50' },
    { key: 'nearingDeadline', label: 'Nearing Deadline', color: '#F59E0B', bg: 'bg-amber-50' },
    { key: 'afterDeadline', label: 'After Deadline', color: '#EF4444', bg: 'bg-red-50' },
    { key: 'overdue', label: 'Overdue', color: '#7C3AED', bg: 'bg-purple-50' },
] as const

export default function AnalyticsChart() {
    const [data, setData] = useState<AnalyticsData | null>(null)

    useEffect(() => {
        getAnalytics().then(setData)
    }, [])

    if (!data || data.total === 0) {
        return (
            <div className="card text-center py-10">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm text-slate-400">No analytics data yet.</p>
                <p className="text-xs text-slate-300 mt-1">Complete some tasks to see insights.</p>
            </div>
        )
    }

    const segments = SEGMENTS.map(s => ({
        ...s,
        value: data[s.key],
        pct: data.total > 0 ? Math.round((data[s.key] / data.total) * 100) : 0,
    })).filter(s => s.value > 0)

    // Build conic-gradient for the pie
    let gradientParts: string[] = []
    let cumulative = 0
    for (const seg of segments) {
        const start = cumulative
        const end = cumulative + (seg.value / data.total) * 100
        gradientParts.push(`${seg.color} ${start}% ${end}%`)
        cumulative = end
    }
    if (cumulative < 100) {
        gradientParts.push(`#E2E8F0 ${cumulative}% 100%`)
    }

    const conicGradient = `conic-gradient(${gradientParts.join(', ')})`

    return (
        <div className="card animate-fadeIn">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5">Task Analytics</h3>

            <div className="flex flex-wrap items-center justify-center gap-8">
                {/* Donut Chart */}
                <div className="relative flex-shrink-0">
                    <div
                        className="w-36 h-36 rounded-full"
                        style={{ background: conicGradient }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                            <span className="text-2xl font-bold text-[var(--primary)] leading-none">{data.total}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Tasks</span>
                        </div>
                    </div>
                </div>

                {/* Legend — responsive auto-fit grid */}
                <div className="flex-1 w-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                    {SEGMENTS.map(seg => (
                        <div key={seg.key} className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${seg.bg}`}>
                            <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                                <span className="text-sm text-slate-700 font-medium">{seg.label}</span>
                            </div>
                            <span className="text-sm font-bold text-[var(--primary)]">{data[seg.key]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
