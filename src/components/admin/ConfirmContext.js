import { createContext, useContext } from 'react'

export const ConfirmContext = createContext(null)

// confirm({ title, message, confirmText, cancelText, tone: 'primary' | 'danger' }) → Promise<boolean>
export function useConfirm() {
  return useContext(ConfirmContext)
}
