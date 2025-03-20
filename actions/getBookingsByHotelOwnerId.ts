import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export const getBookingsByHotelOwnerId = async () => {
  try {
    const user = auth();
    const userId = (await user).userId;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const bookings = await prismadb.booking.findMany({
      where: {
        hotelOwnerId: userId,
      },
      include: {
        Room: true,
        Hotel: true,
      },
      orderBy: {
        bookedAt: "desc",
      },
    });

    if (!bookings) return null;
    return bookings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
