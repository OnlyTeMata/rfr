import type { Metadata } from "next"
import Rounds from "@/app/components/rounds"
import type { Matchh } from "@/app/utils/types"
import { config } from "../../../../config"
import NavBar from "@/app/components/navbar"
import { Shield, Clock, Users, Map } from "lucide-react"

export const metadata: Metadata = {
  title: "Match",
  description: config.description,
  openGraph: {
    type: "website",
    siteName: config.siteName,
    title: config.siteName,
    description: "Matchmaking",
    images: [
      {
        url: "http://",
      },
    ],
  },
}

export default async function Timeline({
  params,
}: {
  params: { id: string }
}) {
  const imageUrl = `${config.apiIp}/matches/matchmaking/${params.id}.png`

  metadata.title = `Matchmaking - ID: ${params.id}`
  metadata.icons = [
    {
      rel: "icon",
      url: `${config.apiIp}/main/site-icon.png`,
    },
  ]
  metadata.openGraph!.title = `ID: ${params.id}`
  metadata.openGraph!.images = [
    {
      url: imageUrl,
    },
  ]

  const getMatchData = async (id: string) => {
    try {
      const response = await fetch(`${process.env.URL}/api/match?type=4&id=${id}`, {
        cache: "no-cache",
      })
      const data = await response.json()
      return data
    } catch (error) {
      return null
    }
  }

  const matchData: Matchh | null = await getMatchData(params.id)

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
    <main className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <NavBar date={matchData?.matchData.Date} />

      <section className="pt-24 px-4 sm:px-6 lg:px-8 relative min-h-screen">
        <div className="max-w-7xl mx-auto">
          {matchData ? (
            <div className="flex flex-col items-center w-full">
              {/* Match Header */}
              <div className="w-full bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      Matchmaking <span className="text-blue-500">#{params.id}</span>
                    </h1>
                    <p className="text-blue-200/80 mt-1">
                      {matchData.matchData.Date && formatDate(matchData.matchData.Date)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-blue-900/20 px-3 py-1.5 rounded-md">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{convertTime(matchData.matchData.Duration)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-900/20 px-3 py-1.5 rounded-md">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{matchData.teamsData.length} Teams</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-900/20 px-3 py-1.5 rounded-md">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{matchData.roundsData.length} Rounds</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-900/20 px-3 py-1.5 rounded-md">
                      <Map className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{matchData.matchData.Map || "Unknown Map"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="w-full flex mb-8">
                <a
                  href={`/matches/matchmaking/${params.id}/scoreboard`}
                  className="bg-black/40 backdrop-blur-sm border-t border-l border-r border-blue-500/20 text-blue-200 px-6 py-3 rounded-t-lg font-medium hover:bg-blue-900/20 transition-colors duration-200"
                >
                  Scoreboard
                </a>
                <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg font-medium">Timeline</div>
              </div>

              {/* Timeline Content */}
              <div className="w-full bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6">
                <Rounds match={matchData.matchData} rounds={matchData.roundsData} teams={matchData.teamsData} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[70vh] bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg">
              <Shield className="w-16 h-16 text-blue-400 mb-4 opacity-50" />
              <h1 className="text-3xl font-bold text-white mb-2">MATCH NOT FOUND</h1>
              <h2 className="text-blue-200/80 text-xl">ID: {params.id}</h2>
              <p className="mt-4 text-blue-200/60 max-w-md text-center">
                The match you're looking for might have been deleted or doesn't exist.
              </p>
              <a
                href="/matches"
                className="mt-6 bg-blue-600/30 hover:bg-blue-600/50 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                Back to Matches
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

