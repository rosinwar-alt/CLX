import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/api/register";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await registerUser(body);

    if ("error" in result) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
