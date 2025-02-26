"use Client";

import useLocation from "@/hooks/useLocation";
import { HotelWithRooms } from "./AddHotelForm";
import { Booking } from "@prisma/client";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Divide, Dumbbell, MapPin, Waves, Wine } from "lucide-react";
import RoomCard from "../room/RoomCard";
import { FaSwimmer, FaSpa } from "react-icons/fa";

const HotelDetailsClient = ({
  hotel,
  bookings,
}: {
  hotel: HotelWithRooms;
  bookings?: Booking[];
}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  const state = getStateByCode(hotel.country, hotel.state);

  // console.log("C", country);
  // console.log("S", state);

  return (
    <div className="flex flex-col gap-6 pb-2">
      <div className="apespect-square overflow-hidden relative w-full  h-[200px] md:h-[300px] rounded-lg">
        <Image
          fill
          src={hotel.image}
          alt={hotel.title}
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="font-semibold text-xl md:text-3xl">{hotel.title} </h3>
        <div className="font-semibold mt-4">
          {country?.name}
          <AmenityItem>
            <MapPin className="h-4 w-4" />
            {country?.name}, {state?.name}, {hotel?.city}
          </AmenityItem>
        </div>
        <h3 className="font-semibold text-lg mt-4 mb-2">Location details</h3>
        <p className="text-primary/90 mb-2">{hotel.locationDescription}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">About this hotel</h3>
        <p className="text-primary/90 mb-2">{hotel.description}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
          {hotel.swimmingPool && (
            <AmenityItem>
              <FaSwimmer />
              Pool
            </AmenityItem>
          )}
          {hotel.gym && (
            <AmenityItem>
              <Dumbbell className="s-4" />
              Gym
            </AmenityItem>
          )}
          {hotel.spa && (
            <AmenityItem>
              <FaSpa />
              Spa
            </AmenityItem>
          )}
          {hotel.bar && (
            <AmenityItem>
              <Wine className="s-4" />
              Bar
            </AmenityItem>
          )}
          {hotel.laundry && (
            <AmenityItem>
              <Wine className="s-4" />
              Laundry facilities
            </AmenityItem>
          )}
        </div>
      </div>
      <div>
        {!!hotel.rooms.length && (
          <div>
            <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotel.rooms.map((room) => {
                return (
                  <RoomCard
                    hotel={hotel}
                    room={room}
                    key={room.id}
                    bookings={bookings}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetailsClient;
