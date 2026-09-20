import { Info, PartyPopper, TriangleAlert } from 'lucide-react'

// Banner styles the admin can pick from.
export const NOTICE_TONES = {
  holiday: { label: 'Festival / Holiday', icon: PartyPopper, className: 'bg-success text-success-foreground' },
  info: { label: 'Information', icon: Info, className: 'bg-primary text-primary-foreground' },
  alert: { label: 'Important alert', icon: TriangleAlert, className: 'bg-destructive text-destructive-foreground' },
}
