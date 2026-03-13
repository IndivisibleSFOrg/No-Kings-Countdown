// Generates and triggers a client-side download of a .ics calendar file
// containing one VEVENT per remaining campaign day (today → March 28, 2026).
// Each event fires an 8am local-time reminder with a day-specific URL.
export function useIcsDownload() {
  function downloadIcs() {
    const CAMPAIGN_END = new Date(2026, 2, 28) // March 28, 2026

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const events: string[] = []
    const todayY = today.getFullYear()
    const todayM = today.getMonth()
    const todayD = today.getDate()
    const dtstamp = formatUtcStamp(new Date())

    for (let offset = 0; ; offset++) {
      // Construct each date via year/month/day+offset to stay DST-safe
      const day = new Date(todayY, todayM, todayD + offset)
      if (day > CAMPAIGN_END)
        break

      const y = day.getFullYear()
      const m = String(day.getMonth() + 1).padStart(2, '0')
      const d = String(day.getDate()).padStart(2, '0')
      const dateKey = `${y}-${m}-${d}`
      const dtStart = `${y}${m}${d}T080000`
      const dtEnd = `${y}${m}${d}T081500`

      events.push(
        [
          'BEGIN:VEVENT',
          `UID:${dateKey}@nokingscountdown.org`,
          `DTSTAMP:${dtstamp}`,
          'SUMMARY:No Kings Daily Action',
          `DTSTART;TZID=${tz}:${dtStart}`,
          `DTEND;TZID=${tz}:${dtEnd}`,
          `DESCRIPTION:Today's action: https://nokingscountdown.org/?date=${dateKey}`,
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          'TRIGGER:PT0S',
          'DESCRIPTION:No Kings Daily Action',
          'END:VALARM',
          'END:VEVENT',
        ].join('\r\n'),
      )
    }

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//No Kings Countdown//nokingscountdown.org//EN',
      'X-WR-CALNAME:No Kings Daily Reminders',
      `X-WR-TIMEZONE:${tz}`,
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'no-kings-countdown.ics'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return { downloadIcs }
}

function formatUtcStamp(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  const h = String(date.getUTCHours()).padStart(2, '0')
  const min = String(date.getUTCMinutes()).padStart(2, '0')
  const s = String(date.getUTCSeconds()).padStart(2, '0')
  return `${y}${m}${d}T${h}${min}${s}Z`
}
