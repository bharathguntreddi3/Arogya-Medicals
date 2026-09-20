import { Banknote, CreditCard, Landmark, Smartphone, Wallet } from 'lucide-react'

// Every payment method the admin can switch on, in display order.
export const PAYMENT_METHODS = [
  { id: 'upi', icon: Smartphone, en: 'UPI', te: 'UPI' },
  { id: 'cash', icon: Banknote, en: 'Cash', te: 'నగదు' },
  { id: 'card', icon: CreditCard, en: 'Card', te: 'కార్డ్' },
  { id: 'netbanking', icon: Landmark, en: 'Net Banking', te: 'నెట్ బ్యాంకింగ్' },
  { id: 'wallet', icon: Wallet, en: 'Wallets', te: 'వాలెట్లు' },
]

export const enabledPaymentMethods = (ids) => PAYMENT_METHODS.filter((m) => ids.includes(m.id))
