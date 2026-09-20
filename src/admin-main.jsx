// Entry point for the admin page (admin.html → yoursite/admin). Separate from the public
// site, so visitors never download any admin code.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SiteSettingsProvider from './settings/SiteSettingsProvider.jsx'
import { LanguageContext } from './i18n/LanguageContext'
import { translations } from './i18n/translations'
import ConfirmProvider from './components/admin/ConfirmProvider.jsx'
import AdminApp from './components/admin/AdminApp.jsx'

// The admin is English-only; previews of site parts (e.g. the banner) read this.
const englishOnly = { lang: 'en', t: translations.en, toggleLanguage: () => {} }

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <SiteSettingsProvider>
      <LanguageContext.Provider value={englishOnly}>
        <ConfirmProvider>
          <AdminApp />
        </ConfirmProvider>
      </LanguageContext.Provider>
    </SiteSettingsProvider>
  </StrictMode>,
)
