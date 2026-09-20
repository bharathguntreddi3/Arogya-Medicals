import { isWithin } from './dates'

// The banner shows while it's switched on, has a message, and its end date
// (shown through the whole of that day, India time) hasn't passed.
export function isNoticeActive(notice, today) {
  if (!notice?.enabled || !(notice.en || notice.te)) return false
  return isWithin(today, null, notice.until)
}
