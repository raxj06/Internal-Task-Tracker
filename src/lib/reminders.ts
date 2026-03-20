/**
 * Calculates a standard reminder schedule based on the task's due date.
 * Default: 24h before, 1h before, and exactly at the due date.
 */
export function calculateReminderSchedule(dueDate: string | Date): string[] {
    const due = new Date(dueDate)
    const now = new Date()
    
    const schedule: string[] = []

    // 24 hours before
    const oneDayBefore = new Date(due.getTime() - 24 * 60 * 60 * 1000)
    if (oneDayBefore > now) schedule.push(oneDayBefore.toISOString())

    // 1 hour before
    const oneHourBefore = new Date(due.getTime() - 60 * 60 * 1000)
    if (oneHourBefore > now) schedule.push(oneHourBefore.toISOString())

    // Exactly at due date
    if (due > now) schedule.push(due.toISOString())

    return schedule
}
