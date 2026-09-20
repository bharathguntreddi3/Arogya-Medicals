import { StrictMode } from 'react'
import App from './App.jsx'
import LanguageProvider from './i18n/LanguageProvider.jsx'
import SiteSettingsProvider from './settings/SiteSettingsProvider.jsx'

// Shared by the browser entry (main.jsx) and the build-time pre-render (entry-server.jsx).
export default function Root({ initialSettings, initialDate }) {
  return (
    <StrictMode>
      <SiteSettingsProvider initial={initialSettings} initialDate={initialDate}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </SiteSettingsProvider>
    </StrictMode>
  )
}
