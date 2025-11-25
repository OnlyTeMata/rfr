"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Tooltip } from "react-tooltip"
import Arenas from "../locales/arenas"
import type { Matchh } from "../utils/types"
import { config } from "../config"

const getAllPlayersStats = (rounds: Matchh["roundsData"], player: any) => {
  let kills = 0
  let headshots = 0
  let damage = 0
  let deaths = 0
  let killsRolas = 0
  rounds.forEach((round) => {
    if (!round.Cancelled) {
      Object.keys(round.History).forEach((team) => {
        round.History[team].User.forEach((p) => {
          if (p.Discord === player.Discord) {
            killsRolas += p.KillsRolas
            headshots += p.Headshots
            kills += p.Kills
            deaths += p.Dead ? 1 : 0
            damage += p.Damage
          }
        })
      })
    }
  })
  return { kills, headshots, damage, deaths, killsRolas }
}

const getPlayersFromTeamName = (rounds: Matchh["roundsData"], teamName: string) => {
  const players: any[] = []
  const round = rounds[rounds.length - 1]
  Object.keys(round.History).forEach((team) => {
    if (team === teamName) {
      round.History[team].User.forEach((player) => {
        if (!players.find((p) => p.Discord === player.Discord)) {
          const stats = getAllPlayersStats(rounds, player)
          players.push({
            ...player,
            Kills: stats.kills,
            Deaths: stats.deaths,
            Damage: stats.damage,
            Headshots: stats.headshots,
            KillsRolas: stats.killsRolas,
          })
        }
      })
    }
  })
  return players
}

export default function Players({
  teams,
  rounds,
  matchData,
  path,
  id,
  type,
}: {
  teams: Matchh["teamsData"]
  rounds: Matchh["roundsData"]
  matchData: Matchh["matchData"]
  id: string | number
  type: string
  path: string
}) {
  const [mvp, setMvp] = useState<any>(null)
  const [nav, setNav] = useState(true)

  const getMvp = () => {
    const players: any[] = []
    rounds.forEach((round) => {
      Object.keys(round.History).forEach((team) => {
        round.History[team].User.forEach((player) => {
          if (!players.find((p) => p.Discord === player.Discord)) {
            const stats = getAllPlayersStats(rounds, player)
            players.push({
              ...player,
              Kills: stats.kills,
              Deaths: stats.deaths,
              Damage: stats.damage,
              Headshots: stats.headshots,
              KillsRolas: stats.killsRolas,
            })
          }
        })
      })
    })
  
    let m: (typeof players)[number] | null = null
    players.forEach((player) => {
      if (!m || player.Kills > m.Kills) {
        m = player
      }
    })
  
    return m
  }
  
  const convertTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor(time / 60)
    const seconds = time - minutes * 60
    return `${hours > 0 ? `${hours}h` : ""} ${minutes > 0 ? `${minutes}m` : ""} ${seconds > 0 ? `${seconds}s` : ""}`
  }

  const getHeadshotRate = (headshots: number, kills: number) => {
    return isNaN(headshots / kills) ? 0 : Math.round((headshots / kills) * 100)
  }

  const getKillsRolasRate = (killsRolas: number, kills: number) => {
    return isNaN(killsRolas / kills) ? 0 : Math.round((killsRolas / kills) * 100)
  }

  useEffect(() => {
    setMvp(getMvp())
  }, [rounds])

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (search.get('nav') === 'false') setNav(false);
  }, []);
  

  return (
    <>
      <h1 className="text-fml-100 font-[700] text-[4vh] uppercase text-center tracking-wide mb-[1vh]">{type}</h1>
      <h2 className="text-zinc-400 text-center font-[400] text-[1.8vh]">ID: {id}</h2>
      <div className="flex gap-[4vh] mt-[2vh] justify-center">
        <h1 className="text-zinc-100 relative text-[1.7vh] font-[400]">
          SCOREBOARD
          <div className="absolute top-0 mt-[2.6vh] left-0 w-full h-[0.25vh] bg-fml-100" />
        </h1>
        {nav && (
          <Link
            href={`/matches/${path}/${id}/timeline`}
            className="text-zinc-400 cursor-pointer hover:text-fml-100 transition-all text-[1.7vh] font-[400]"
          >
            TIMELINE
          </Link>
        )}
      </div>

      {/* Single-line container */}
      <div className="flex flex-nowrap items-center justify-center gap-[2vh] px-[3vw] mt-[3vh] overflow-x-auto whitespace-nowrap">
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">{Arenas[matchData.Map]}</h1>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Map</h1>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">{matchData.RadioAnimations ? "Yes" : "No"}</h1>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Radio</h1>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">{matchData.Crouch ? "Yes" : "No"}</h1>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Crouch</h1>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">{matchData.Energetic ? "Yes" : "No"}</h1>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Energetic</h1>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">{matchData.OnlyHs ? "Yes" : "No"}</h1>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Only HS</h1>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">{rounds.length}</h1>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Rounds</h1>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">{matchData.ScoreToWin} + 1</h1>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Score</h1>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">{convertTime(matchData.Duration)}</h1>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Duration</h1>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">{teams.length}</h1>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Teams</h1>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <h1 className="text-zinc-200 font-[700] text-[1.8vh]">
            {new Date(matchData.Date * 1000).getDate()}/
            {new Date(matchData.Date * 1000).getMonth()}/{new Date(matchData.Date * 1000).getFullYear()}
          </h1>
          <h1 className="text-zinc-500 font-[400] text-[1.3vh]">
            {new Date(matchData.Date * 1000).getHours()}:{new Date(matchData.Date * 1000).getMinutes()}
          </h1>
        </div>
        <div className="flex gap-[0.6vh] flex-col items-center flex-shrink-0">
          <div className="flex gap-[0.6vh] items-center">
            {matchData.Weapons.map((weapon, index) => (
              <div key={index}>
                <Tooltip id={`weapon-${index}`} />
                <img
                  src={`${config.apiIp}/weapons/${weapon.toLowerCase()}.png`}
                  data-tooltip-id={`weapon-${index}`}
                  data-tooltip-content={weapon}
                  className="h-[1.8vh] object-cover"
                />
              </div>
            ))}
          </div>
          <h1 className="text-zinc-500 uppercase font-[400] text-[1.3vh]">Weapons</h1>
        </div>
      </div>

      <div
        className={`flex ${
          nav
            ? "flex-col items-center w-[75%] mt-[3vh] mb-[5vh]"
            : `${
                teams.length > 3 ? "gap-[3vh] flex-wrap mb-[5vh]" : "gap-[3vh] mb-[5vh] items-center"
              } mt-[3vh] w-[95%]`
        } mx-auto justify-center`}
      >
        {teams
          .sort((a, b) => (b.Name === matchData.Winner ? 1 : -1))
          .map((team, index) => (
            <div
              key={index}
              className={`flex ${
                !nav ? `flex-col ${teams.length > 3 ? "w-[48%]" : "w-[100%]"}` : "lg:flex-row flex-col"
              } items-center w-full justify-center mb-[4vh]`}
            >
              <div className="flex-col flex gap-[0.7vh] items-center mb-[2vh] lg:mb-0 lg:mr-[3vh]">
                <div className="rounded-[0.8vmin] flex items-center justify-center text-zinc-200 font-[900] text-[2.8vh] h-[5.8vh] w-[5.8vh] bg-gradient-to-tr from-fml-100/[60%] to-fml-100/[15%] border-[0.15vh] border-fml-100/[20%] shadow-lg">
                  {team.Score}
                </div>
                <Tooltip id={team.Name} />
                <div
                  style={{ flexDirection: nav ? "column" : "row", gap: nav ? "0" : "0.6vh" }}
                  className="text-zinc-200 flex overflow-hidden text-ellipsis whitespace-normal break-words text-[1.3vh] uppercase font-[400] text-center"
                >
                  <span
                    data-tooltip-id={team.Name}
                    data-tooltip-content={team.Name}
                    data-tooltip-hidden={team.Name.length <= 5}
                    className="max-w-[7vh] overflow-hidden text-ellipsis"
                  >
                    {team.Name}
                  </span>
                  {index === 0 && (
                    <span className="text-green-500 text-center">
                      WINNER{" "}
                      {matchData.FF && (
                        <>
                          <Tooltip id="FF" />
                          <span data-tooltip-id="FF" data-tooltip-content="Forfeit" className="text-orange-500">
                            FF
                          </span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <Tooltip id="hrate" />
              <Tooltip id="rrate" />
              <div className="w-full max-w-[100%] flex justify-center">
                <table style={{ borderCollapse: "separate", borderSpacing: "0.2vh" }} className="text-center">
                  <thead
                    style={{ opacity: nav ? (index === 0 && nav ? 1 : 0) : 1 }}
                    className="text-[1.3vh] uppercase h-[3.5vh] text-zinc-400"
                  >
                    <tr>
                      <th scope="col" className="text-left pl-[2vh] font-[400] px-[1vh]">Player</th>
                      <th scope="col" className="font-[400] px-[1vh]">Kills</th>
                      <th scope="col" className="font-[400] px-[1vh]">Deaths</th>
                      <th scope="col" className="font-[400] px-[1vh]">K/D</th>
                      <th data-tooltip-id="hrate" data-tooltip-content="Headshot rate" className="font-[400] px-[1vh]">
                        HSR
                      </th>
                      <th data-tooltip-id="rrate" data-tooltip-content="Kills Rolas rate" className="font-[400] px-[1vh]">
                        KRR
                      </th>
                      <th scope="col" className="font-[400] px-[1vh]">Damage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-[0.02vh] divide-zinc-600/[25%]">
                    {getPlayersFromTeamName(rounds, team.Name)
                      .sort((a, b) => b.Kills - a.Kills)
                      .map((player: any, i: number) => (
                        <tr key={i} className="text-[1.4vh] bg-fml-900 text-zinc-300">
                          <td className="relative px-[1vh] py-[0.5vh] max-w-[20vw] word-break break-all flex items-center h-[100%]">
                            <img
                              src={player.Avatar ?? ""}
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  "https://i.pinimg.com/736x/05/78/01/0578014576b782b4e50450a2ea562180.jpg"
                              }}
                              className="h-[4vh] w-[4vh] absolute object-cover"
                            />
                            <h1 className="ml-[4.5vh] flex flex-col lg:flex-row lg:items-center whitespace-normal text-[1.6vh] break-words">
                              {player.Name ?? `Not found (${player.Discord})`}
                              <span className="text-zinc-500 ml-[0.3vh]">#{player.Id}</span>
                              {mvp?.Discord === player.Discord && (
                                <span className="text-zinc-200 px-[0.5vh] py-[0.1vh] bg-fml-100 text-[1.1vh] rounded-md ml-[0.4vh]">
                                  MATCH MVP
                                </span>
                              )}
                              {i === 0 && mvp?.Discord !== player.Discord && (
                                <span className="text-zinc-200 px-[0.5vh] py-[0.1vh] bg-fml-100/[50%] text-[1.1vh] rounded-md ml-[0.4vh]">
                                  TEAM MVP
                                </span>
                              )}
                            </h1>
                          </td>
                          <td className="bg-gradient-to-tr text-zinc-200 from-fml-100/[60%] to-fml-100/[15%] border-[0.1vh] border-fml-100/[20%]">
                            {player.Kills}
                          </td>
                          <td>{player.Deaths}</td>
                          <td className="bg-gradient-to-tr text-zinc-200 from-fml-100/[60%] to-fml-100/[15%] border-[0.1vh] border-fml-100/[20%]">
                            {isNaN(player.Kills / player.Deaths)
                              ? "0.0"
                              : isFinite(player.Kills / player.Deaths)
                              ? (player.Kills / player.Deaths).toFixed(1)
                              : player.Kills + ".0"}
                          </td>
                          <td>{getHeadshotRate(player.Headshots, player.Kills)}%</td>
                          <td>{getKillsRolasRate(player.KillsRolas, player.Kills)}%</td>
                          <td>{player.Damage}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}
