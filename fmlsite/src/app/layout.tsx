import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { config } from "./config"

export const metadata: Metadata = {
  title: config.siteName,
  description: config.description,
  icons: [
    {
      rel: "icon",
      url: `${config.apiIp}/main/site-icon.png`,
    },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



import './globals.css'