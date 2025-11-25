"use client"
import { useEffect, useState } from "react"
import type React from "react"
import Link from "next/link"
import { Shield, Calendar, Clock, Users } from "lucide-react"
import Input from "../components/input"
import { type Matchh, MatchType, MatchTypeTrue } from "../utils/types"
import { config } from "../config"
import Arenas from "../locales/arenas"
import NavBar from "../components/navbar"

const convertTime = (time: number) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor(time / 60)
  const seconds = time - minutes * 60
  return `${hours > 0 ? `${hours}h` : ""} ${minutes > 0 ? `${minutes}m` : ""} ${seconds > 0 ? `${seconds}s` : ""}`
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const Match: React.FC<{ data: Matchh }> = ({ data }) => {
  const winner = data.matchData.Winner

  return (
    <Link
      href={`/matches/${MatchTypeTrue[data.matchData.Type].toLowerCase()}/${
        data.matchData.Id.split("-")[1]
      }/scoreboard`}
      className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col"
    >
      <div className="h-40 bg-gradient-to-r from-blue-900/30 to-blue-700/30 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={`${config.apiIp}/maps/${data.matchData.Map}.png`}
            onError={(e) => (e.currentTarget.src = `${config.apiIp}/maps/default.webp`)}
            alt="Map"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute top-3 right-3 bg-blue-500/80 text-white text-xs font-medium px-2 py-1 rounded">
          {MatchTypeTrue[data.matchData.Type]}
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(data.matchData.Date)}
        </div>
      </div>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold">Match ID: {data.matchData.Id}</h3>
          <span className="text-blue-400 text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {convertTime(data.matchData.Duration)}
          </span>
        </div>

        <div className="text-sm text-blue-200/80 mb-4">
          {data.teamsData.length === 2 ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                {data.teamsData[0].Name === winner && (
                  <span className="text-green-400 font-semibold text-xs mb-0.5">Winner</span>
                )}
                <span>{data.teamsData[0].Name}</span>
              </div>
              <span className="font-bold text-white">VS</span>
              <div className="flex flex-col items-center">
                {data.teamsData[1].Name === winner && (
                  <span className="text-green-400 font-semibold text-xs mb-0.5">Winner</span>
                )}
                <span>{data.teamsData[1].Name}</span>
              </div>
            </div>
          ) : (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {data.teamsData.map((team) => team.Name).join(" vs ")}
            </span>
          )}
        </div>

        <div className="flex justify-between text-sm text-blue-200/80 mb-4">
          <span>{data.roundsData.length} rounds</span>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-white">{Arenas[data.matchData.Map] || data.matchData.Map}</span>
          </div>
          <span className="text-xs bg-blue-600/30 hover:bg-blue-600/50 text-white px-3 py-1 rounded transition-colors duration-200">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Matches() {
  const [matches, setMatches] = useState<Matchh[]>([])
  const [matchType, setMatchType] = useState(MatchType.Casual)
  const [maps, setMaps] = useState<[string, string][]>([])
  const [map, setMap] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      try {
        const response = await fetch(`./api/allMatches?type=${matchType}&map=${map}`, {
          method: "GET",
          cache: "no-cache",
        })
        const data = await response.json()
        const sortedMatches = [...(data.data.matches ?? [])].sort((a, b) => b.matchData.Date - a.matchData.Date)
        setMatches(sortedMatches)
      } catch (error) {
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    const fetchMaps = async () => {
      try {
        const response = await fetch(`${config.apiIp}/api/v1/fml_og/json?category=matches`, {
          method: "GET",
          cache: "force-cache",
        })
        const data = await response.json()
        if (data) {
          const trueType = MatchTypeTrue[matchType as keyof typeof MatchTypeTrue]
          setMaps([])
          data.map((map: any) => {
            if (map.type.includes(trueType)) {
              setMaps((prev) => [...prev, [map.name, Arenas[map.name]]])
            }
          })
        }
      } catch (error) {}
    }

    fetchMatches()
    fetchMaps()
  }, [matchType, map])

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <NavBar />
      <section className="pt-32 pb-10 text-center relative">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px]"></div>
        <h1 className="text-5xl font-bold text-white relative">MATCHES</h1>
        <p className="mt-4 text-lg text-blue-200/80 max-w-2xl mx-auto">
          Explore recent matches and track player performance across different game modes
        </p>
        <Input currentType={matchType} />
      </section>
      <section className="py-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center flex-wrap gap-3 mb-6">
            {Object.values(MatchType).map((type, index) => (
              <button
                key={index}
                onClick={() => setMatchType(type)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  matchType === type
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-black/40 border border-blue-500/20 text-blue-200 hover:bg-blue-900/30"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex justify-center flex-wrap gap-3">
            <button
              onClick={() => setMap("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                map === "all"
                  ? "bg-blue-600/80 text-white"
                  : "bg-black/40 border border-blue-500/20 text-blue-200 hover:bg-blue-900/30"
              }`}
            >
              ALL MAPS
            </button>
            {maps.map(([name, value], index) => (
              <button
                key={index}
                onClick={() => setMap(name)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  name === map
                    ? "bg-blue-600/80 text-white"
                    : "bg-black/40 border border-blue-500/20 text-blue-200 hover:bg-blue-900/30"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          {!loading && matches.length === 0 && (
            <div className="text-center py-20 bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg">
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">No Matches Found</h3>
              <p className="text-blue-200/80">Try changing your filters or check back later</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
              <Match key={index} data={match} />
            ))}
          </div>
        </div>
      </section>
      <footer className="relative mt-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 blur-3xl opacity-40"></div>
        <div className="relative z-10 bg-black/60 backdrop-blur-md text-white border-t border-blue-500/30 rounded-2xl shadow-lg shadow-blue-500/5 py-12 px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img
                src="https://api.fmlpvp.it/main/3.png"
                alt="FML Logo"
                className="h-12 w-auto transition-transform duration-300 hover:scale-110"
              />
              <p className="mt-4 text-sm text-blue-300/80 max-w-xs">
                Experience the most intense PvP battles. Join our community and fight for glory!
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-center">
              <Link href="/" className="text-blue-300 hover:text-blue-500 transition-all duration-300">
                Home
              </Link>
              <Link href="/matches" className="text-blue-300 hover:text-blue-500 transition-all duration-300">
                Matches
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-blue-500/20"></div>
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-blue-300/70 text-sm">
            <p>© {new Date().getFullYear()} FML PVP. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span className="text-blue-400 animate-pulse">●</span> Powered by Eragon
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
