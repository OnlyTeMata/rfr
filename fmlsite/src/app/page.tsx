"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Globe, Rocket, Users, Zap, Trophy, ArrowRight, Shield, Clock, Calendar, Map } from "lucide-react"
import NavBar from "./components/navbar"
import { config } from "./config"
import type { Matchh } from "./utils/types"

export default function Home() {
  const [players, setPlayers] = useState(0)
  const [latestMatches, setLatestMatches] = useState<Matchh[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("https://servers-frontend.fivem.net/api/servers/single/e79ezd")
        const data = await response.json()
        setPlayers(data.Data?.clients || 0)
      } catch {
        setPlayers(0)
      }
    }
  
    const fetchLatestMatches = async () => {
      setLoading(true)
      try {
        const response = await fetch("./api/allMatches?type=Matchmaking&map=all", {
          method: "GET",
          cache: "no-cache",
        })
        const data = await response.json()
        setLatestMatches((data.data.matches || []).slice(0, 4))
      } catch {
        setLatestMatches([])
      } finally {
        setLoading(false)
      }
    }
  
    fetchPlayers()
    fetchLatestMatches()
    const interval = setInterval(fetchPlayers, 60000)
    return () => clearInterval(interval)
  }, [])  

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const convertTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor(time / 60)
    const seconds = time - minutes * 60
    return `${hours > 0 ? `${hours}h` : ""} ${minutes > 0 ? `${minutes}m` : ""} ${seconds > 0 ? `${seconds}s` : ""}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center pointer-events-none [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <NavBar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 w-[min(800px,100vw)] h-[min(800px,100vh)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/3 w-[min(600px,100vw)] h-[min(600px,100vh)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300 text-xs sm:text-sm font-medium mb-4">
                #1 PVP EXPERIENCE
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                FML <span className="text-blue-500">PVP</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-blue-200/80 max-w-xl mx-auto lg:mx-0">
                Experience the most intense PvP battles. Join thousands of players in epic combat arenas.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://cfx.re/join/"
                  className="z-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base sm:text-lg px-6 py-2 sm:px-8 sm:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                  PLAY NOW
                </a>
                <div className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-black/60 rounded-lg border border-blue-500/20 text-blue-200/80 text-sm sm:text-base">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <span>Players Online:</span>
                  <span className="text-blue-400 font-semibold">{players}</span>
                  <span>/</span>
                  <span>48</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-[90vw] sm:max-w-md lg:max-w-lg">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black/50 border border-blue-500/20 shadow-2xl">
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none"></div>
                <img
                  src="https://api.fmlpvp.it/main/logogif.gif"
                  alt="FML PVP"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 w-[min(600px,100vw)] h-[min(600px,100vh)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Game <span className="text-blue-500">Modes</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-blue-200/80 max-w-2xl mx-auto">
              Choose from a variety of game modes to test your skills
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-blue-500/20 bg-black/40 backdrop-blur-sm hover:bg-blue-900/10 transition-all duration-300 transform hover:scale-105 shadow-lg group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-3">Competitive</h3>
              <p className="text-blue-200/80 text-center text-sm sm:text-base">
                Ranked matches with ELO system. Climb the leaderboards and prove your worth.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-blue-500/20 bg-black/40 backdrop-blur-sm hover:bg-blue-900/10 transition-all duration-300 transform hover:scale-105 shadow-lg group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-3">Team Deathmatch</h3>
              <p className="text-blue-200/80 text-center text-sm sm:text-base">
                Fast-paced team battles. Work together to eliminate the enemy team.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-blue-500/20 bg-black/40 backdrop-blur-sm hover:bg-blue-900/10 transition-all duration-300 transform hover:scale-105 shadow-lg group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-3">Custom Matches</h3>
              <p className="text-blue-200/80 text-center text-sm sm:text-base">
                Create your own rules and invite friends for private matches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Matchmaking Matches Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center sm:text-left">
              Latest <span className="text-blue-500">Matchmaking</span>
            </h2>
            <Link
              href="/matches"
              className="mt-4 sm:mt-0 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              View all matches <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : latestMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestMatches.map((match, index) => (
                <Link
                  key={index}
                  href={`/matches/matchmaking/${match.matchData.Id.split("-")[1]}/scoreboard`}
                  className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col h-full"
                >
                  <div className="h-36 sm:h-40 bg-gradient-to-r from-blue-900/30 to-blue-700/30 relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <img
                        src={`${config.apiIp}/maps/${match.matchData.Map}.png`}
                        onError={(e) => (e.currentTarget.src = `${config.apiIp}/maps/default.webp`)}
                        alt="Map"
                        className="w-full h-full object-cover opacity-70"
                      />
                    </div>
                    <div className="absolute top-2 right-2 bg-blue-500/80 text-white text-xs font-medium px-2 py-1 rounded">
                      Matchmaking
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(match.matchData.Date)}
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base">
                        Match #{match.matchData.Id.split("-")[1]}
                      </h3>
                      <span className="text-blue-400 text-xs sm:text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {convertTime(match.matchData.Duration)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-blue-200/80 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {match.teamsData.map((team) => team.Name).join(" vs ")}
                      </span>
                      <span>{match.roundsData.length} rounds</span>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Map className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                        </div>
                        <span className="text-white text-sm sm:text-base">{match.matchData.Map || "Unknown"}</span>
                      </div>
                      <span className="text-xs bg-blue-600/30 hover:bg-blue-600/50 text-white px-2 py-1 sm:px-3 sm:py-1 rounded transition-colors duration-200">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Matchmaking Matches Found</h3>
              <p className="text-blue-200/80 text-sm sm:text-base">Check back later for the latest matchmaking matches</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/3 w-[min(600px,100vw)] h-[min(600px,100vh)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Premium <span className="text-blue-500">Features</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-blue-200/80 max-w-2xl mx-auto">
              Discover what makes FML PVP the ultimate combat experience
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Advanced Matchmaking</h3>
              <p className="text-blue-200/80 text-sm sm:text-base">
                Our sophisticated matchmaking system ensures balanced and competitive matches every time.
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Detailed Statistics</h3>
              <p className="text-blue-200/80 text-sm sm:text-base">
                Track your performance with comprehensive statistics and watch your skills evolve.
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Global Leaderboards</h3>
              <p className="text-blue-200/80 text-sm sm:text-base">
                Compete globally and climb the leaderboards to become a legend in the FML PVP community.
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Regular Updates</h3>
              <p className="text-blue-200/80 text-sm sm:text-base">
                Enjoy new maps, weapons, and game modes with frequent updates to enhance your experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/3 w-[min(600px,100vw)] h-[min(600px,100vh)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to <span className="text-blue-500">Fight</span>?
          </h2>
          <p className="text-blue-200/80 mb-8 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of players in last-man-standing PvP battles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cfx.re/join/"
              className="z-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base sm:text-lg px-6 py-2 sm:px-8 sm:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
              PLAY NOW
            </a>
            <a
              href={config.discord}
              className="z-20 bg-black/50 text-blue-200 font-semibold text-base sm:text-lg px-6 py-2 sm:px-8 sm:py-3 rounded-lg border border-blue-500/20 hover:bg-blue-900/20 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              DISCORD
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mt-12 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 blur-3xl opacity-40 pointer-events-none"></div>
        <div className="relative z-10 bg-black/60 backdrop-blur-md text-white border-t border-blue-500/30 rounded-2xl shadow-lg shadow-blue-500/5 py-10 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img
                src="https://api.fmlpvp.it/main/3.png"
                alt="FML Logo"
                className="h-10 sm:h-12 w-auto transition-transform duration-300 hover:scale-110"
              />
              <p className="mt-4 text-xs sm:text-sm text-blue-300/80 max-w-xs">
                Experience the most intense PvP battles. Join our community and fight for glory!
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-center">
              <Link href="/" className="text-blue-300 hover:text-blue-500 transition-all duration-300 text-sm sm:text-base">
                Home
              </Link>
              <Link href="/matches" className="text-blue-300 hover:text-blue-500 transition-all duration-300 text-sm sm:text-base">
                Matches
              </Link>
            </div>
            <div className="flex gap-4">
              <a
                href={config.discord}
                className="p-2 sm:p-3 bg-black/50 hover:bg-blue-600/30 rounded-xl transition-all duration-300 transform hover:scale-110"
              >
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 hover:text-white" />
              </a>
              <a
                href={config.tiktok}
                className="p-2 sm:p-3 bg-black/50 hover:bg-blue-600/30 rounded-xl transition-all duration-300 transform hover:scale-110"
              >
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 hover:text-white" />
              </a>
            </div>
          </div>
          <div className="mt-6 border-t border-blue-500/20"></div>
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-blue-300/70 text-xs sm:text-sm">
            <p>© {new Date().getFullYear()} FML PVP. All rights reserved.</p>
            <p className="flex items-center gap-1 mt-2 md:mt-0">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 animate-pulse" /> Powered by Eragon
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}