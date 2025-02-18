import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  //   console.log("TGGG", params.hotelId);
  try {
    const body = await req.json();

    const user = auth();
    const userId = (await user).userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.hotelId) {
      return new NextResponse("Hotel Id is required", { status: 400 });
    }

    const hotel = await prismadb.hotel.update({
      where: {
        id: params.hotelId,
      },
      data: { ...body },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.log("Error at /api/hotelId PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const user = auth();
    const userId = (await user).userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hotel = await prismadb.hotel.delete({
      where: {
        id: params.hotelId,
      },
    });

    return NextResponse.json(hotel);
  } catch (error: any) {
    // console.log("Error at /api/hotelId DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
