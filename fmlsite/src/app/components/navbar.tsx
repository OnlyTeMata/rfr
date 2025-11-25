"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { config } from "../config"

export default function NavBar({ date }: { date?: number }) {
  const [visible, setVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const search = new URLSearchParams(window.location.href)
    if (search.entries().next().value[1] === "false") {
      setVisible(false)
    }
  }, [])

  if (!visible) {
    return (
      <div className="flex absolute z-[3] flex-col items-center gap-[0.5vh] w-[100%] mt-[93vh]">
        <h1 className="text-zinc-500 font-[500] text-[1.5vh] tracking-wider" suppressHydrationWarning={true}>
          {date ? new Date(date * 1000).toLocaleDateString() : ""} -{" "}
          {date ? new Date(date * 1000).toLocaleTimeString() : ""}
        </h1>
        <div className="flex items-center gap-[2vh]">
          <img src={`${config.apiIp}/main/3.png`} className="h-[2.5vh]" />
          <h1 className="text-zinc-300 font-[500] text-[1.7vh] tracking-wider">discord.gg/fmlpvp</h1>
        </div>
      </div>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md shadow-lg shadow-blue-500/10 border-b border-blue-500/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src={`${config.apiIp}/main/3.png`}
                alt="FML logo"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-blue-200 hover:text-white transition-colors duration-200">
                HOME
              </Link>
     
              <Link href="/matches" className="text-blue-200 hover:text-white transition-colors duration-200">
                MATCHES
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a
              href={config.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600/30 text-white font-medium hover:bg-blue-600/50 rounded-md transition-all duration-200"
            >
              Join Discord
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-blue-600/20 rounded-md transition-colors duration-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-blue-200 hover:text-white hover:bg-blue-600/20 rounded-md transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              HOME
            </Link>
            <Link
              href="/matches"
              className="block px-3 py-2 text-blue-200 hover:text-white hover:bg-blue-600/20 rounded-md transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              MATCHES
            </Link>
            <a
              href={config.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-blue-200 hover:text-white hover:bg-blue-600/20 rounded-md transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              JOIN DISCORD
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

