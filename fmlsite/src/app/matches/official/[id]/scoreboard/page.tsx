import type { Metadata } from "next"

import Players from "@/app/components/players"
import NavBar from "@/app/components/navbar"
import type { Matchh } from "@/app/utils/types"
import { config } from "../../../../config"

export const metadata: Metadata = {
  title: "Match",
  description: config.description,
  openGraph: {
    type: "website",
    siteName: config.siteName,
    title: config.siteName,
    description: "Official",
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
  const imageUrl = `${config.apiIp}/matches/official/${params.id}.png`

  metadata.title = `Official Match - ID: ${params.id}`
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
      const response = await fetch(`${process.env.URL}/api/match?type=1&id=${id}`, {
        method: "GET",
        cache: "no-cache",
      })
      const data = await response.json()
      return data
    } catch (error) {
      return null
    }
  }

  const matchData: Matchh | null = await getMatchData(params.id)

  return (
    <main className="flex bg-gradient-to-t from-fml-100/[5%] to-fml-100/[30%] flex-col w-screen h-screen">
      <NavBar date={matchData?.matchData.Date} />
      <section className="flex z-[1] items-center flex-col py-[2vh] w-screen h-[100%] overflow-hidden overflow-y-auto">
        {matchData ? (
          <div className="flex flex-col items-center h-[100%] w-[100%]">
            <Players
              teams={matchData.teamsData}
              rounds={matchData.roundsData}
              matchData={matchData.matchData}
              type={"Official match"}
              path={"official"}
              id={params.id}
            />
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

