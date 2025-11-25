export async function GET() {
  const res = await fetch(`http://localhost:30120/dynamic.json`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  })

  if (!res.ok) {
    return Response.json({
      response: {
        clients: 0,
      },
    })
  }

  const response = await res.json()

  if (!response) {
    return Response.json({
      response: {
        clients: 0,
      },
    })
  }

  return Response.json({ response })
}

