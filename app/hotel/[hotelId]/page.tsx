// import { getHotelById } from "@/actions/getHotelById";
// import { AddHotelForm } from "@/components/hotel/AddHotelForm";
// import { useAuth } from "@clerk/nextjs";
// import { auth } from "@clerk/nextjs/server";

// interface HotelPageProps {
//   params: {
//     hotelId: string;
//   };
// }

// const Hotel = async ({ params }: HotelPageProps) => {
//   const { hotelId } = await params; // Ensure params is awaited

//   const hotel = await getHotelById(hotelId);
//   //   console.log("TG", params.hotelId);
//   // const hotel = await getHotelById(params.hotelId);

//   // const authcon = auth();
//   // const userId = (await authcon).userId;

//   const authcon = await auth();
//   const userId = authcon?.userId;

//   if (!userId) return <div>Not authenticated ...</div>;
//   if (hotel && hotel.userId !== userId) return <div>Access denied...</div>;

//   return (
//     <div>
//       <AddHotelForm />
//     </div>
//   );
// };

// export default Hotel;

import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

interface HotelPageProps {
  params: {
    hotelId: string;
  };
}

const Hotel = async ({ params }: HotelPageProps) => {
  const { hotelId } = await params; // Ensure params is awaited

  const hotel = await getHotelById(hotelId);
  const authcon = await auth();
  const userId = authcon?.userId;

  if (!userId) return <div>Not authenticated ...</div>;
  if (hotel && hotel.userId !== userId) return <div>Access denied...</div>;

  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default Hotel;
