import React from 'react'
import ReactDOM from 'react-dom/client'
import { initTheme } from '../utils/themeManager'
import WebsiteApp from './WebsiteApp'

initTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WebsiteApp />
  </React.StrictMode>
)

