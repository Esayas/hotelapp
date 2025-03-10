import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = auth();
    const userId = (await user).userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await prismadb.room.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at /api/room POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
