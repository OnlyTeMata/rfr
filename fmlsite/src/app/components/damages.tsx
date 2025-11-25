import type { History } from "../utils/types"

export default function Damages({
  taken,
  given,
  name,
  round,
}: {
  taken: Record<string, number>
  given: Record<string, number>
  round: History
  avatar: string
  name: string
}) {
  const getPlayerFromDiscord = (discord: string) => {
    for (const key in round) {
      for (const user of round[key].User) {
        if (user.Discord === discord) {
          return {
            name: user.Name,
            team: key,
            avatar: user.Avatar,
          }
        }
      }
    }
  }

  return (
    <div className="flex h-[100%] gap-[2vh]">
      <div className="flex flex-col gap-[1vh]">
        <h1 className="text-zinc-300 font-[600] text-[1.3vh] tracking-wider">DAMAGE TAKEN</h1>
        {Object.entries(taken).map(([discord, damage]) => {
          const player = getPlayerFromDiscord(discord)
          return (
            <div className="flex items-center gap-[1vh]">
              <img
                src={player?.avatar ?? ""}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    "https://i.pinimg.com/736x/05/78/01/0578014576b782b4e50450a2ea562180.jpg"
                }}
                className="h-[3vh]"
              />
              <h1 className="text-zinc-300 font-[500] text-[1.2vh] tracking-wider">{player?.name ?? "Not found"}</h1>
              <h1 className="text-zinc-300 font-[500] text-[1.2vh] tracking-wider">{damage}</h1>
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-[1vh]">
        <h1 className="text-zinc-300 font-[600] text-[1.3vh] tracking-wider">DAMAGE GIVEN</h1>
        {Object.entries(given).map(([discord, damage]) => {
          const player = getPlayerFromDiscord(discord)
          return (
            <div className="flex items-center gap-[1vh]">
              <img
                src={player?.avatar ?? ""}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    "https://i.pinimg.com/736x/05/78/01/0578014576b782b4e50450a2ea562180.jpg"
                }}
                className="h-[3vh]"
              />
              <h1 className="text-zinc-300 font-[500] text-[1.2vh] tracking-wider">{player?.name ?? "Not found"}</h1>
              <h1 className="text-zinc-300 font-[500] text-[1.2vh] tracking-wider">{damage}</h1>
            </div>
          )
        })}
      </div>
    </div>
  )
}

