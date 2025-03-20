import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export const getHotelsByUserId = async () => {
  try {
    const user = auth();
    const userId = (await user).userId;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const hotels = await prismadb.hotel.findMany({
      where: { userId },
      include: { rooms: true },
    });

    if (!hotels) return null;
    return hotels;
  } catch (error: any) {
    throw new Error(error);
  }
};
