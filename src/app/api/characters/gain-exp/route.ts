import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { grantExperience } from "@/features/character/server/progression.service";
import { gainExpSchema } from "@/features/character/validation/progression";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const result = gainExpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        error: "Invalid input",
        details: result.error.format()
      }, { status: 400 });
    }

    // For this foundation, we'll assume the user has one primary character
    // or we would pass characterId in the body.
    // Given the current scope, let's find the first active character of the user.
    const { prisma } = await import("@/lib/prisma");
    const character = await prisma.character.findFirst({
      where: { userId },
    });

    if (!character) {
      return NextResponse.json({ error: "No character found for this user" }, { status: 404 });
    }

    const updatedCharacter = await grantExperience(character.id, result.data.amount);

    return NextResponse.json(updatedCharacter, { status: 200 });
  } catch (error: any) {
    if (error.message === "Dead characters cannot gain experience") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message === "Character not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
