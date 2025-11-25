import { connectToDatabase } from "../private/db"

enum MatchType {
  Casual = 0,
  Official = 1,
  Ranked = 2,
  Tournament = 3,
  Matchmaking = 4,
}

function collect(number: number, matches: any[]) {
  let i = 0
  const data = []
  while (i < number && i < matches.length) {
    data.push({ ...matches[i], roundData: null })
    i++
  }
  return data
}

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url)

  const matchType = params.entries().next().value[1] as string | null
  const map = params.get("map") as string | null

  const db = await connectToDatabase()
  const collection = await db
    .collection("matchs")
    .find(
      map === "all"
        ? {
            ["matchData.Type"]: MatchType[matchType as keyof typeof MatchType] as MatchType,
          }
        : {
            ["matchData.Type"]: MatchType[matchType as keyof typeof MatchType] as MatchType,
            ["matchData.Map"]: map,
          },
    )
    .sort({ "matchData.Date": -1 })
    .limit(10)
    .toArray()

  const data = {
    matches: collection,
  }

  return Response.json({ data })
}

