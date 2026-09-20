// Link builders for the admin-editable contact details (see siteDefaults.js).

export const ENQUIRY_MESSAGE = "Hi Arogya Medicals, I'd like to enquire about medicine availability."

// 9885191077 → "98851 91077"
export const formatPhone = (digits) =>
  digits.length === 10 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits

export const telLink = (digits) => `tel:+91${digits}`

export const whatsappLink = (digits, message) =>
  `https://wa.me/91${digits}?text=${encodeURIComponent(message)}`

export const mapsLink = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export const mapsEmbed = (query) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
