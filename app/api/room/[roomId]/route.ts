import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  //   console.log("TGGG", params.roomId);
  try {
    const body = await req.json();

    const user = auth();
    const userId = (await user).userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.roomId) {
      return new NextResponse("Room Id is required", { status: 400 });
    }

    const room = await prismadb.room.update({
      where: {
        id: params.roomId,
      },
      data: { ...body },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at /api/roomId PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const user = auth();
    const userId = (await user).userId;

    console.log("Id", params.roomId);
    if (!params.roomId) {
      return new NextResponse("Room Id is required", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await prismadb.room.delete({
      where: {
        id: params.roomId,
      },
    });

    return NextResponse.json(room);
  } catch (error: any) {
    // console.log("Error at /api/roomId DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
