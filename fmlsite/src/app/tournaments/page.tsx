"use client"
import { Construction } from "lucide-react"
import NavBar from "../components/navbar"

export default function Tournaments() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <NavBar />

      <section className="flex flex-col items-center justify-center h-screen px-4">
        <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
          <Construction className="w-12 h-12 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-xl text-blue-200/80 text-center max-w-md">
          This page is under construction. Check back later for exciting tournament features.
        </p>
        <a
          href="/"
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
        >
          Back to Home
        </a>
      </section>
    </main>
  )
}

