import type { Metadata } from "next"

import Link from "next/link"
import Rounds from "@/app/components/rounds"
import type { Matchh } from "@/app/utils/types"
import { config } from "../../../../config"

const getMatchData = async (id: string) => {
  try {
    const response = await fetch(`${process.env.URL}/api/match?type=0&id=${id}`, {
      cache: "no-cache",
    })
    const data = await response.json()
    return data
  } catch (error) {
    return null
  }
}

export const metadata: Metadata = {
  title: "Match",
  description: config.description,
  openGraph: {
    type: "website",
    siteName: config.siteName,
    title: config.siteName,
    description: "Casual",
    images: [
      {
        url: "http://",
      },
    ],
  },
}

export default async function Scoreboard({
  params,
}: {
  params: { id: string }
}) {
  const imageUrl = `${config.apiIp}/matches/casual/${params.id}.png`

  metadata.title = `Casual Match - ID: ${params.id}`
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

  const matchData: Matchh | null = await getMatchData(params.id)

  return (
    <main className="flex bg-gradient-to-t from-fml-100/[5%] to-fml-100/[30%] flex-col w-screen h-screen">
      <header className="flex z-[1] lg:justify-start justify-center items-center bg-black/[70%] px-[3vh] w-full gap-[7vh] backdrop-blur-[5px] h-[7vh]">
        <img draggable="false" src={`${config.apiIp}/main/3.png`} className="h-[2vh] hidden lg:block" />
        <div className="flex items-center gap-[6vh] h-[100%]">
          <Link
            href={"/"}
            className="text-zinc-400 cursor-pointer hover:text-fml-100 transition-all text-[1.7vh] tracking-wide font-[300]"
          >
            HOME
          </Link>
          <h1 className="text-zinc-100 relative cursor-pointer hover:text-fml-100 transition-all text-[1.7vh] tracking-wide font-[300]">
            MATCHES
            <div className="absolute top-0 mt-[-2vh] left-0 w-full h-[0.4vh] bg-fml-100" />
          </h1>
        </div>
      </header>
      <section className="flex z-[1] items-center flex-col py-[2vh] w-screen h-[100%] overflow-hidden overflow-y-auto">
        {matchData ? (
          <div className="flex flex-col items-center h-[100%] w-[100%]">
            <h1 className="text-fml-100 font-[600] text-[4vh]">CASUAL MATCH</h1>
            <h2 className="text-zinc-400 font-[400] mt-[-1vh] text-[1.8vh]">ID: {params.id}</h2>

            <div className="flex gap-[5vh] mt-[2vh]">
              <Link
                href={`/matches/casual/${params.id}/scoreboard`}
                className="text-zinc-400 relative cursor-pointer hover:text-fml-100 transition-all text-[1.7vh] tracking-wide font-[300]"
              >
                SCOREBOARD
              </Link>
              <h1 className="text-zinc-100 relative text-[1.7vh] tracking-wide font-[300]">
                TIMELINE
                <div className="absolute top-0 mt-[3vh] left-0 w-full h-[0.4vh] bg-fml-100" />
              </h1>
            </div>

            <Rounds match={matchData.matchData} rounds={matchData.roundsData} teams={matchData.teamsData} />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-fml-100 font-[600] text-[4vh]">MATCH NOT FOUND</h1>
            <h2 className="text-zinc-400 font-[400] mt-[-1vh] text-[1.8vh]">ID: {params.id}</h2>
          </div>
        )}
      </section>

      <img src="/banner.png" className="absolute z-[0] w-[100%] h-[100%] object-cover opacity-[40%] blur-[5px]" />
    </main>
  )
}

