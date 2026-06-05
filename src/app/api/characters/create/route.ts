import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleCreateCharacter } from "@/features/character/api/character-api";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const result = await handleCreateCharacter(userId, body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error, details: result.details }, { status: result.status });
    }

    return NextResponse.json(result.character, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
