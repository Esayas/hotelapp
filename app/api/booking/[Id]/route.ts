import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { Id: string } }
) {
  try {
    // const body = await req.json();

    const user = auth();
    const userId = (await user).userId;
    // console.log("PayIDTG", params.Id);

    if (!params.Id) {
      return new NextResponse("Payment intent Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const booking = await prismadb.booking.update({
      where: {
        paymentIntentId: params.Id,
      },
      data: {
        paymentStatus: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.log("Error at /api/booking/Id PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const user = auth();
    const userId = (await user).userId;

    if (!params.Id) {
      return new NextResponse("booking Id is required", {
        status: 400,
      });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const booking = await prismadb.booking.delete({
      where: {
        id: params.Id,
      },
    });

    return NextResponse.json(booking);
  } catch (error: any) {
    console.log("Error at /api/booking/Id DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const user = auth();
    const userId = (await user).userId;

    if (!params.Id) {
      return new NextResponse("Room Id is required", {
        status: 400,
      });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await prismadb.booking.findMany({
      where: {
        paymentStatus: true,
        roomId: params.Id,
        endDate: {
          gt: yesterday,
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.log("Error at /api/booking/Id GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
