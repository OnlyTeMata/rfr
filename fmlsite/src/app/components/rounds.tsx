"use client"
import { useEffect, useState } from "react"
import type { Matchh } from "../utils/types"

import Damages from "./damages"

import { Tooltip } from "react-tooltip"

export default function Rounds({
  rounds,
  teams,
  match,
}: {
  rounds: Matchh["roundsData"]
  teams: Matchh["teamsData"]
  match: Matchh["matchData"]
}) {
  const [selectedRound, setSelectedRound] = useState(0)
  const [mvp, setMvp] = useState<any>(null)

  const convertTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time

    return `${minutes > 0 ? `${minutes}m` : ""} ${seconds > 0 ? `${seconds}s` : ""}`
  }

  const getStatsPercentFromTeamToOtherTeams = (round: number, team: string) => {
    let totalDamage = 0
    let teamDamage = 0

    const winned = rounds[round].Winner === team

    Object.entries(rounds[round].History).forEach(([teamName, teamData]) => {
      if (teamName !== team) {
        teamData.User.forEach((player) => {
          totalDamage += player.Damage
        })
      } else {
        teamData.User.forEach((player) => {
          teamDamage += player.Damage
        })
      }
    })

    return totalDamage === 0
      ? Math.min(100, winned ? 100 : 20)
      : Math.min(100, (teamDamage / totalDamage) * 100 + (winned ? 100 : -200))
  }

  const getRoundIsOverTime = (round: number) => {
    return rounds[round].Overtime
  }

  const getHalf = (round: number) => {
    return rounds[round] && rounds[round].isHalf
  }

  const getPlayersCrashed = (round: number) => {
    const playersCrashed: any = []

    const previousRound = round - 1

    Object.entries(rounds[round].History).forEach(([team, teamData]) => {
      teamData.User.forEach((player) => {
        if (player.Crashed) {
          // check if was crashed previous round
          let wasCrashed = false

          if (previousRound >= 0) {
            const previousRoundData = rounds[previousRound].History[team].User.find(
              (previousPlayer) => previousPlayer.Discord === player.Discord,
            )

            if (previousRoundData && previousRoundData.Crashed) {
              wasCrashed = true
            }
          }

          if (!wasCrashed) {
            playersCrashed.push({ ...player, Team: team })
          }
        }
      })
    })

    return playersCrashed
  }

  const getPlayersComeback = (round: number) => {
    const playersComeback: any = []

    if (round === 0) {
      return []
    }

    const crashed = getPlayersCrashed(round - 1)

    Object.entries(rounds[round].History).forEach(([team, teamData]) => {
      teamData.User.forEach((player) => {
        if (crashed.find((crashedPlayer: any) => crashedPlayer.Discord === player.Discord) && !player.Crashed) {
          playersComeback.push({ ...player, Team: team })
        }
      })
    })

    return playersComeback
  }

  const getPlayersKicked = (round: number) => {
    const playersKicked: any = []

    const previousRound = round - 1

    Object.entries(rounds[round].History).forEach(([team, teamData]) => {
      teamData.User.forEach((player) => {
        if (player.Kicked && !player.Crashed) {
          let wasKicked = false

          if (previousRound >= 0) {
            const previousRoundData = rounds[previousRound].History[team].User.find(
              (previousPlayer) => previousPlayer.Discord === player.Discord,
            )

            if (previousRoundData && previousRoundData.Kicked) {
              wasKicked = true
            }
          }

          if (!wasKicked) {
            playersKicked.push({ ...player, Team: team })
          }
        }
      })
    })

    return playersKicked
  }

  const getTeamsFlawless = (round: number) => {
    const teamsFlawless: any = []

    Object.entries(rounds[round].History).forEach(([team, teamData]) => {
      if (teamData.Teams.Flawless) {
        teamsFlawless.push(team)
      }
    })

    return teamsFlawless
  }

  const getMVP = (round: number) => {
    let mvp: any = null
    let maxKills = 0

    Object.entries(rounds[round].History).forEach(([team, teamData]) => {
      teamData.User.forEach((player) => {
        if (player.Kills > maxKills) {
          maxKills = player.Kills
          mvp = player
        }
      })
    })

    return mvp
  }

  const getHeadshotRate = (headshots: number, kills: number) => {
    return isNaN(headshots / kills) ? 0 : Math.round((headshots / kills) * 100)
  }

  const getKillsRolasRate = (killsRolas: number, kills: number) => {
    return isNaN(killsRolas / kills) ? 0 : Math.round((killsRolas / kills) * 100)
  }

  useEffect(() => {
    setMvp(getMVP(selectedRound))
  }, [selectedRound])

  return (
    <div className="w-[93%] gap-[2vh] flex flex-col h-[100%] mt-[3vh]">
      <div className="flex gap-[1vh] justify-center items-center flex-wrap">
        {rounds.map((round, index) => (
          <div key={index} className="flex gap-[1vh] items-center">
            <div
              onClick={() => setSelectedRound(index)}
              className={`min-w-[6vh] px-[0.7vh] py-[0.7vh] flex-col items-center justify-center gap-[0.2vh] flex transition-all cursor-pointer hover:opacity-[80%] w-fit h-[13vh] ${
                selectedRound === index
                  ? round.Cancelled
                    ? "bg-red-500/[15%] border-b-[0.3vh] border-fml-100"
                    : "bg-zinc-100/[15%] border-b-[0.3vh] border-fml-100"
                  : round.Cancelled
                    ? "bg-red-500/[15%]"
                    : "bg-zinc-100/[5%]"
              }`}
            >
              <h1 className="text-zinc-200 text-[1.3vh] font-[600]">{index + 1}</h1>
              <div className="flex items-center h-[100%] gap-[0.5vh]">
                {Object.entries(round.History)
                  .sort(([teamA], [teamB]) => (teamA.localeCompare(teamB) ? 1 : -1))
                  .map(([team], newIndex) => (
                    <>
                      <Tooltip
                        style={{
                          fontSize: "1.1vh",
                          backgroundColor: "rgb(11 12 13)",
                        }}
                        id={`history-${newIndex}`}
                      ></Tooltip>
                      <div key={newIndex} className="flex h-[100%] items-center flex-col gap-[0.7vh]">
                        <div className="w-[2vh] h-[100%] py-[0.2vh] flex items-end px-[0.2vh] bg-zinc-200/[5%]">
                          <div
                            style={{
                              height: `${getStatsPercentFromTeamToOtherTeams(index, team)}%`,
                            }}
                            className="w-[100%] bg-fml-100"
                          ></div>
                        </div>
                        <Tooltip
                          style={{
                            fontSize: "1.1vh",
                            backgroundColor: "rgb(11 12 13)",
                          }}
                          id={`name-${newIndex}`}
                        ></Tooltip>
                        <h1
                          data-tooltip-id={`name-${newIndex}`}
                          data-tooltip-content={team}
                          data-tooltip-hidden={team.length <= 4}
                          className="text-zinc-300 mb-[-0.3vh] text-[1vh] font-[500]"
                        >
                          {team.slice(0, 4)}
                        </h1>
                      </div>
                    </>
                  ))}
              </div>
            </div>
            {getHalf(index + 1) && rounds[index + 2] && (
              <>
                <Tooltip
                  style={{
                    fontSize: "1.1vh",
                    backgroundColor: "rgb(11 12 13)",
                  }}
                  id={`half-${index}`}
                ></Tooltip>

                <svg
                  data-tooltip-id={`half-${index}`}
                  data-tooltip-content="Half"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  className="h-[2vh] w-[2vh]"
                  viewBox="0 -0.5 17 17"
                  version="1.1"
                >
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(1.000000, 0.000000)" className="fill-zinc-200">
                      <path d="M1.539,8.001 C2.367,8.001 2.918,7.45 2.918,6.622 L2.914,6.187 C2.914,6.187 2.709,4.954 4.354,4.954 L11.015,5 L11.015,6.759 C11.338,7.081 11.862,7.081 12.185,6.759 L14.758,4.187 C15.08,3.863 15.08,3.339 14.758,3.017 L12.185,0.292 C11.862,-0.03 11.338,-0.03 11.015,0.292 L11.015,2.137 C10.854,2.09 4.562,2.063 4.562,2.063 C0.851,2.063 0.039,4.492 0.039,5.47 L0.039,6.501 C0.039,7.329 0.711,8.001 1.539,8.001 L1.539,8.001 Z"></path>
                      <path d="M13.5,8.042 C12.672,8.042 12,8.626 12,9.454 L12.002,10.411 C11.957,10.768 11.357,11.001 10.477,11.001 L3.938,11.001 L3.936,9.442 C3.614,9.12 3.09,9.12 2.766,9.442 L0.194,12.014 C-0.128,12.338 -0.128,12.862 0.194,13.184 L2.766,15.756 C3.09,16.08 3.614,16.08 3.936,15.756 L3.938,13.905 L10.477,13.905 C14.188,13.905 15,11.463 15,10.484 L15,9.453 C15,8.626 14.328,8.042 13.5,8.042 L13.5,8.042 Z"></path>
                    </g>
                  </g>
                </svg>
              </>
            )}
            {rounds[index + 1] && getRoundIsOverTime(index + 1) && !getRoundIsOverTime(index) && (
              <>
                <Tooltip
                  style={{
                    fontSize: "1.1vh",
                    backgroundColor: "rgb(11 12 13)",
                  }}
                  id={`overtime`}
                ></Tooltip>
                <h1
                  data-tooltip-id={`overtime`}
                  data-tooltip-content="Overtime"
                  className="text-[1.5vh] text-zinc-200 tracking-wider"
                >
                  OT
                </h1>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="w-[100%] h-[0.05vh] bg-zinc-500/[30%]"></div>
      <div className="flex items-center w-[100%] justify-between">
        <h1 className="text-zinc-300 flex items-center gap-[0.5vh] font-[500] tracking-wider uppercase text-[2vh] mt-[-0.5vh]">
          ROUND{" "}
          {rounds[selectedRound].Cancelled ? (
            <div>CANCELLED</div>
          ) : (
            <div>
              {selectedRound + 1} <span className="text-zinc-400">|</span>{" "}
              <span className="text-fml-100">{rounds[selectedRound].Winner}</span> (WINNER)
            </div>
          )}
        </h1>
        <div className="flex items-center gap-[2vh]">
          <h1 className="text-zinc-400">
            ROUND DURATION:{" "}
            <span className="text-zinc-200 font-[600]">{convertTime(rounds[selectedRound].Duration)}</span>
          </h1>
          {rounds[selectedRound].Spectators && rounds[selectedRound].Spectators.length > 0 && (
            <div className="flex items-center gap-[1vh]">
              <h1 className="text-zinc-400">SPECTATORS</h1>
              <div className="flex gap-[0.5vh]">
                {rounds[selectedRound].Spectators.map((spectator, index) => (
                  <>
                    <Tooltip
                      style={{
                        position: "absolute",
                        backgroundColor: "rgb(11 12 13)",
                        fontSize: "1.1vh",
                      }}
                      id={`spectator-${index}`}
                    />

                    <img
                      key={index}
                      src={spectator.Avatar}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          "https://i.pinimg.com/736x/05/78/01/0578014576b782b4e50450a2ea562180.jpg"
                      }}
                      data-tooltip-id={`spectator-${index}`}
                      data-tooltip-content={spectator.Name + " #" + spectator.Id}
                      className="h-[2.5vh] w-[2.5vh] rounded-full"
                    />
                  </>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap lg:gap-[9vh] gap-[2vh] w-[100%]">
        <div className="flex flex-col w-[60vh] gap-[1vh]">
          {Object.entries(rounds[selectedRound].History)
            .sort(([teamA], [teamB]) => {
              return teamA === rounds[selectedRound].Winner ? -1 : 1
            })
            .map(([team, teamData], index) => (
              <div key={index} className="flex flex-col lg:flex-row items-center w-[100%]">
                {teamData.User.map((player, index) => {
                  return (
                    <Tooltip
                      style={{
                        position: "absolute",
                        backgroundColor: "rgb(11 12 13)",
                        fontSize: "1.1vh",
                      }}
                      id={`player-${team}-${index}`}
                    >
                      <Damages
                        taken={player.DamageTakenList}
                        given={player.DamageGivenList}
                        round={rounds[selectedRound].History}
                        name={player.Name}
                        avatar={player.Avatar}
                      ></Damages>
                    </Tooltip>
                  )
                })}
                <div className="flex-col flex gap-[0.7vh] items-center">
                  <div className="rounded-[1vmin] flex items-center justify-center text-zinc-200 font-[800] text-[3vh] h-[6vh] w-[6vh] bg-gradient-to-tr from-fml-100/[60%] to-fml-100/[15%] border-[0.1vh] border-fml-100/[20%]">
                    {teamData.Teams.Score}
                  </div>
                  <Tooltip
                    style={{
                      fontSize: "1.1vh",
                      backgroundColor: "rgb(11 12 13)",
                    }}
                    id={`teamName-${team}`}
                  ></Tooltip>
                  <div
                    data-tooltip-id={`teamName-${team}`}
                    data-tooltip-content={team}
                    data-tooltip-hidden={team.length <= 7}
                    className="text-zinc-200 whitespace-nowrap max-w-[6vh] overflow-hidden text-ellipsis text-[1.2vh] tracking-wider uppercase font-[400]"
                  >
                    {team}
                  </div>
                </div>
                <table
                  style={{
                    borderCollapse: "revert",
                    borderSpacing: "0.2vh",
                  }}
                  className="w-[100%] mb-[3.5vh] h-fit lg:ml-[3vh] text-[1.6vmin] text-center"
                >
                  <Tooltip id="hrate"></Tooltip>
                  <Tooltip id="rrate"></Tooltip>

                  <thead
                    style={{
                      opacity: index === 0 ? 1 : 0,
                    }}
                    className="text-[1.3vh] uppercase h-[3.5vh] w-[100%] text-zinc-400"
                  >
                    <tr>
                      <th scope="col" className="text-left pl-[5vh] font-[400]">
                        Player
                      </th>
                      <th scope="col" className="font-[400]">
                        Kills
                      </th>
                      <th scope="col" className="font-[400]">
                        Deaths
                      </th>
                      <th scope="col" className="font-[400]">
                        K/D
                      </th>
                      <th
                        data-tooltip-id="hrate"
                        data-tooltip-content={`Headshot rate`}
                        scope="col"
                        className="font-[400] w-fit px-[1.5vh]"
                      >
                        HSR
                      </th>
                      <th
                        data-tooltip-id="rrate"
                        data-tooltip-content={`Kills Rolas rate`}
                        scope="col"
                        className="font-[400] w-fit px-[1.5vh]"
                      >
                        KRR
                      </th>
                      <th scope="col" className="font-[400]">
                        Damage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-[0.01vh] w-[100%] divide-zinc-600/[20%]">
                    {teamData.User.map((player, index) => (
                      <>
                        <tr
                          key={index}
                          data-tooltip-id={`player-${team}-${index}`}
                          style={{
                            opacity: player.Kicked || player.Crashed ? 0.5 : 1,
                          }}
                          className={`text-[1.3vh] cursor-pointer bg-fml-900 h-[4vh] text-zinc-300`}
                        >
                          <td className="w-[12vw] relative h-[100%] gap-[2vh] flex items-center">
                            <img
                              src={player.Avatar ?? ""}
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  "https://i.pinimg.com/736x/05/78/01/0578014576b782b4e50450a2ea562180.jpg"
                              }}
                              className="h-[4vh] absolute w-[4vh] object-cover"
                            />
                            <div className="flex flex-col ml-[5vh] justify-start items-start">
                              <h1 className="whitespace-nowrap text-[1.6vh] max-w-[9.5vw] text-ellipsis overflow-hidden">
                                {player.Name ?? `Not found (${player.Discord})`}{" "}
                                <span className="text-zinc-500">#{player.Id}</span>
                              </h1>
                              {player.Crashed && !player.Kicked ? (
                                <div className="text-[1vh] mt-[-0.5vh] text-left text-red-500">Crashed</div>
                              ) : player.Kicked ? (
                                <div className="text-[1vh] mt-[-0.5vh] text-red-500">Kicked</div>
                              ) : null}
                            </div>
                          </td>
                          <td className="w-[7vw] bg-gradient-to-tr from-fml-100/[60%] to-fml-100/[15%] border-[0.1vh] border-fml-100/[20%]">
                            {player.Kills}
                          </td>
                          <td className="w-[7vw]">{player.Dead ? 1 : 0}</td>
                          <td className="w-[5vw] bg-gradient-to-tr from-fml-100/[60%] to-fml-100/[15%] border-[0.1vh] border-fml-100/[20%]">
                            {player.Kills + 0.0}
                          </td>
                          <td className="w-[5vw]">{getHeadshotRate(player.Headshots, player.Kills)}%</td>
                          <td className="w-[5vw]">{getKillsRolasRate(player.KillsRolas, player.Kills)}%</td>
                          <td className="w-[5vw]">{player.Damage}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-[2vh] w-[45vh]">
          <h1 className="text-zinc-400 text-center uppercase text-[1.3vh] font-[400]">Info</h1>

          {getTeamsFlawless(selectedRound).length === 0 &&
            getPlayersCrashed(selectedRound).length === 0 &&
            getPlayersComeback(selectedRound).length === 0 &&
            getPlayersKicked(selectedRound).length === 0 && (
              <h1 className="text-zinc-500 mt-[2vh] text-center font-[400] text-[1.3vh]">No info found</h1>
            )}

          <div className="w-[100%] gap-[0.5vh] flex flex-wrap">
            {getTeamsFlawless(selectedRound).map((team: any, index: any) => (
              <div key={index} className="w-[90vw] h-[4vh] flex items-center gap-[1.5vh] bg-fml-900">
                <div className="h-[100%] w-[4vh] bg-gradient-to-tr from-fml-100/[60%] to-fml-100/[15%]"></div>
                <div className="flex text-[1.4vh] w-[84%] text-ellipsis overflow-hidden text-zinc-200 flex-col justify-start items-start">
                  <h1 className="whitespace-nowrap text-ellipsis overflow-hidden">
                    {team} <span className="text-zinc-400">has won the round without any deaths (flawless)</span>
                  </h1>
                </div>
              </div>
            ))}

            {getPlayersComeback(selectedRound).map((player: any, index: number) => (
              <div key={index} className="w-[100%] h-[4vh] flex items-center gap-[1.5vh] bg-fml-900">
                <img
                  src={player.Avatar ?? ""}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      "https://i.pinimg.com/736x/05/78/01/0578014576b782b4e50450a2ea562180.jpg"
                  }}
                  className="h-[100%] w-[4vh] object-cover"
                />
                <div className="flex text-[1.4vh] w-[84%] text-ellipsis overflow-hidden text-zinc-200 flex-col justify-start items-start">
                  <h1 className="whitespace-nowrap flex items-center gap-[0.5vh] text-ellipsis overflow-hidden">
                    {player.Name ? (
                      <>
                        <span className="text-zinc-400">[{player.Team}]</span>
                        {player.Name} <span className="text-zinc-500">#{player.Id}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-zinc-400">[{player.Team}]</span>
                        Not found
                      </>
                    )}
                    <span className="text-zinc-400">has come back from the previous round</span>
                  </h1>
                </div>
              </div>
            ))}

            {getPlayersCrashed(selectedRound).map((player: any, index: number) => (
              <div key={index} className="w-[100%] h-[4vh] flex items-center gap-[1.5vh] bg-fml-900">
                <img
                  src={player.Avatar ?? ""}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      "https://i.pinimg.com/736x/05/78/01/0578014576b782b4e50450a2ea562180.jpg"
                  }}
                  className="h-[100%] w-[4vh] object-cover"
                />
                <div className="flex text-[1.4vh] w-[84%] text-ellipsis overflow-hidden text-zinc-200 flex-col justify-start items-start">
                  <h1 className="whitespace-nowrap flex items-center gap-[0.5vh] text-ellipsis overflow-hidden">
                    {player.Name ? (
                      <>
                        <span className="text-zinc-400">[{player.Team}]</span>
                        {player.Name} <span className="text-zinc-500">#{player.Id}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-zinc-400">[{player.Team}]</span>
                        Not found
                      </>
                    )}
                    <span className="text-zinc-400">crashed from the match</span>
                  </h1>
                </div>
              </div>
            ))}

            {rounds[selectedRound].Cancelled && (
              <div className="w-[100%] h-[4vh] flex items-center gap-[1.5vh] bg-fml-900">
                <div className="flex text-[1.4vh] px-[1.5vh] w-[84%] text-ellipsis overflow-hidden text-zinc-200 flex-col justify-start items-start">
                  <h1 className="whitespace-nowrap flex items-center gap-[0.5vh] text-ellipsis overflow-hidden">
                    This round
                    <span className="text-zinc-400">has been cancelled (RR)</span>
                  </h1>
                </div>
              </div>
            )}

            {getPlayersKicked(selectedRound).map((player: any, index: number) => (
              <div key={index} className="w-[100%] h-[4vh] flex items-center gap-[1.5vh] bg-fml-900">
                <img
                  src={player.Avatar ?? ""}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      "https://i.pinimg.com/736x/05/78/01/0578014576b782b4e50450a2ea562180.jpg"
                  }}
                  className="h-[100%] w-[4vh] object-cover"
                />
                <div className="flex text-[1.4vh] w-[84%] text-ellipsis overflow-hidden text-zinc-200 flex-col justify-start items-start">
                  <h1 className="whitespace-nowrap flex items-center gap-[0.5vh] text-ellipsis overflow-hidden">
                    {player.Name ? (
                      <>
                        <span className="text-zinc-400">[{player.Team}]</span>
                        {player.Name} <span className="text-zinc-500">#{player.Id}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-zinc-400">[{player.Team}]</span>
                        Not found
                      </>
                    )}
                    <span className="text-zinc-400">has been kicked from the match</span>
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-[51vh]">
          <h1 className="text-zinc-400 text-center uppercase text-[1.3vh] font-[400]">MVP Round</h1>

          {!mvp && <h1 className="text-zinc-500 mt-[2vh] text-center font-[400] text-[1.3vh]">No MVP found</h1>}

          {mvp && (
            <table
              style={{
                borderCollapse: "revert",
                borderSpacing: "0.2vh",
              }}
              className="w-[100%] h-fit lg:ml-[3vh] text-[1.6vmin] text-center"
            >
              <Tooltip id="hrate"></Tooltip>
              <Tooltip id="rrate"></Tooltip>

              <thead className="text-[1.3vh] uppercase h-[3.5vh] w-[100%] text-zinc-400">
                <tr>
                  <th scope="col" className="text-left pl-[5vh] font-[400]">
                    Player
                  </th>
                  <th scope="col" className="font-[400]">
                    Kills
                  </th>
                  <th scope="col" className="font-[400]">
                    deaths
                  </th>
                  <th scope="col" className="font-[400]">
                    K/D
                  </th>
                  <th
                    data-tooltip-id="hrate"
                    data-tooltip-content={`Headshot rate`}
                    scope="col"
                    className="font-[400] w-fit px-[1.5vh]"
                  >
                    HSR
                  </th>
                  <th
                    data-tooltip-id="rrate"
                    data-tooltip-content={`Kills Rolas rate`}
                    scope="col"
                    className="font-[400] w-fit px-[1.5vh]"
                  >
                    KRR
                  </th>
                  <th scope="col" className="font-[400]">
                    Damage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-[0.01vh] w-[100%] divide-zinc-600/[20%]">
                <tr
                  style={{
                    opacity: mvp.Kicked || mvp.Crashed ? 0.5 : 1,
                  }}
                  className={`text-[1.3vh] bg-fml-900 h-[4vh] text-zinc-300`}
                >
                  <td className="w-[13vw] relative h-[100%] gap-[2vh] flex items-center">
                    <img
                      src={mvp.Avatar ?? ""}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          "https://i.pinimg.com/736x/05/78/01/0578014576b782b4e50450a2ea562180.jpg"
                      }}
                      className="h-[4vh] absolute w-[4vh] object-cover"
                    />
                    <div className="flex flex-col ml-[5vh] justify-start items-start">
                      <h1 className="whitespace-nowrap text-[1.6vh] max-w-[10.5vw] text-ellipsis overflow-hidden">
                        {mvp.Name ?? `Not found (${mvp.Discord})`} <span className="text-zinc-500">#{mvp.Id}</span>
                      </h1>
                      {mvp.Crashed && !mvp.Kicked ? (
                        <div className="text-[1vh] mt-[-0.5vh] text-left text-red-500">Crashed</div>
                      ) : mvp.Kicked ? (
                        <div className="text-[1vh] mt-[-0.5vh] text-red-500">Kicked</div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-[2vh] bg-gradient-to-tr from-fml-100/[60%] to-fml-100/[15%] border-[0.1vh] border-fml-100/[20%]">
                    {mvp.Kills}
                  </td>
                  <td className="px-[2vh]">{mvp.Dead ? 1 : 0}</td>
                  <td className="px-[2vh] bg-gradient-to-tr from-fml-100/[60%] to-fml-100/[15%] border-[0.1vh] border-fml-100/[20%]">
                    {mvp.Kills + 0.0}
                  </td>
                  <td className="w-[5vw]">{getHeadshotRate(mvp.Headshots, mvp.Kills)}%</td>
                  <td className="w-[5vw]">{getKillsRolasRate(mvp.KillsRolas, mvp.Kills)}%</td>
                  <td className="px-[2vh]">{mvp.Damage}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

