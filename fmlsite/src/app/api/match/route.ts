import { connectToDatabase } from "../private/db"

const transformHistory = (history: any) => {
  return new Promise(async (resolve, reject) => {
    for (const key in history) {
      for (let i = 0; i < history[key].User.length; i++) {
        const user = history[key].User[i]

        if (user) {
          const response = await fetch(`http://fmlpvp.it:8080/api/v1/user/${user.Discord}`)

          const data = await response.json()

          user.Avatar = data.avatar
          user.Name = data.username
        }
      }
    }

    resolve(history)
  })
}

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url)

  const matchType = params.entries().next().value[1] as string | null
  const id = params.get("id") as string | null

  const db = await connectToDatabase()

  const collection = await db.collection("matchs").findOne({
    ["matchData.Type"]: Number(matchType),
    ["matchData.Id"]: matchType + "-" + id,
  })

  if (collection) {
    const history = await transformHistory(collection.roundsData[0].History)
    collection.roundsData[0].History = history

    for (let i = 1; i < collection.roundsData.length; i++) {
      const round = collection.roundsData[i]

      for (const key in round.History) {
        for (let i = 0; i < round.History[key].User.length; i++) {
          const user = round.History[key].User[i]
          const userHistory = collection.roundsData[0].History[key].User.find((e: any) => e.Discord === user.Discord)

          if (userHistory) {
            user.Name = userHistory.Name
            user.Avatar = userHistory.Avatar
          }
        }
      }

      if (round.Spectators) {
        for (let i = 0; i < round.Spectators.length; i++) {
          const user = round.Spectators[i]

          if (user) {
            const response = await fetch(`http://fmlpvp.it:8080/api/v1/user/${user.Discord}`)

            const data = await response.json()

            user.Avatar = data.avatar
            user.Name = data.username
          }
        }
      }
    }
  }

  return Response.json(collection)
}

