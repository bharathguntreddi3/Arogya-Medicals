// Today's date in India as YYYY-MM-DD (en-CA formats dates that way).
export const todayInIndia = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(date)

// Inclusive date-range check on YYYY-MM-DD strings (they compare correctly as text).
export const isWithin = (day, from, until) => (!from || day >= from) && (!until || day <= until)
