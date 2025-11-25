"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

const paths = ["casual", "official", "ranked", "tournament", "matchmaking"]

export default function Input({ currentType }: { currentType: string }) {
  const router = useRouter()

  const redirectTo = (url: string) => {
    router.push(url)
  }

  return (
    <div className="relative flex items-center w-full max-w-md mx-auto mt-4">
      <div className="absolute left-3 text-blue-400">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            // Search for match id
            const matchId: any = event.currentTarget.value
            if (matchId) {
              const matchIdArr = matchId.split("-")
              if (matchIdArr.length === 2) {
                router.push(
                  `/matches/${paths[Number.parseInt(matchIdArr[0]) % paths.length]}/${matchIdArr[1]}/scoreboard`,
                )
              } else {
                router.push(`/matches/${currentType.toLowerCase()}/${matchId}/scoreboard`)
              }
            }
          }
        }}
        placeholder="Search for a match id..."
        className="w-full h-12 pl-10 pr-4 outline-none bg-black/40 border border-blue-500/30 rounded-lg text-white placeholder:text-blue-300/50 focus:border-blue-500/70 transition-all duration-200"
      />
    </div>
  )
}

