// src/app/api/waitlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await prisma.waitlist.create({
      data: { email },
    });

    return NextResponse.json({ message: "Added to waitlist" }, { status: 200 });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}