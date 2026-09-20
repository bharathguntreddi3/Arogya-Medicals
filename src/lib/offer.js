import { isWithin } from './dates'

// The discount the site shows today: a scheduled offer wins while it's running,
// otherwise the everyday discount (null = "Best Discounts" wording).
export function effectiveDiscount(offer, today) {
  const promo = offer.scheduled
  if (promo?.discount && isWithin(today, promo.from, promo.until)) return promo.discount
  return offer.discount ?? null
}
