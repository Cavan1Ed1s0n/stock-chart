import { NextResponse } from "next/server"
import { createClient } from "@vercel/postgres"

// This endpoint would handle saving and retrieving events from a database
export async function GET(request: Request) {
  try {
    const client = createClient()
    await client.connect()

    const { rows } = await client.sql`
      SELECT * FROM events ORDER BY date DESC;
    `

    await client.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { date, description, color, imageUrl } = await request.json()

    const client = createClient()
    await client.connect()

    const { rows } = await client.sql`
      INSERT INTO events (date, description, color, image_url)
      VALUES (${date}, ${description}, ${color}, ${imageUrl})
      RETURNING *;
    `

    await client.end()

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
