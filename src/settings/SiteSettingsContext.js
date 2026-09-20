import { createContext, useContext, useMemo } from 'react'
import {
  ENQUIRY_MESSAGE,
  formatPhone,
  mapsEmbed,
  mapsLink,
  telLink,
  whatsappLink,
} from '../lib/contact'

export const SiteSettingsContext = createContext(null)

// { settings, today, discount, setSetting(id, value), refresh() }
// `discount` is what the site shows today (scheduled offer or everyday discount, or null).
export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

// Contact details plus ready-made links, from the admin-editable settings.
export function useContact() {
  const { contact } = useSiteSettings().settings

  return useMemo(() => {
    const maps = mapsLink(contact.mapsQuery)
    return {
      ...contact,
      phoneDisplay: formatPhone(contact.phone),
      phoneIntl: `+91 ${formatPhone(contact.phone)}`,
      tel: telLink(contact.phone),
      whatsapp: whatsappLink(contact.whatsapp, ENQUIRY_MESSAGE),
      whatsappWith: (message) => whatsappLink(contact.whatsapp, message),
      maps,
      mapsEmbed: mapsEmbed(contact.mapsQuery),
      review: contact.reviewLink || maps,
    }
  }, [contact])
}
