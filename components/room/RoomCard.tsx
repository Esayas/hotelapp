"use client";

import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
// import AmenityItem from "../AmenityItem";
import {
  AirVent,
  Bed,
  BedDouble,
  Castle,
  Home,
  Loader2,
  MountainSnow,
  Pencil,
  Plus,
  Ship,
  Trash,
  Trees,
  Tv,
  UtensilsCrossed,
  VolumeX,
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import AmenityItem from "../AmenityItem";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { differenceInBusinessDays, eachDayOfInterval } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  // const RoomCard = ({ hotel, room, bookings }: RoomCardProps) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room?.roomPrice);
  const [includeBreakFast, setIncludeBreakFast] = useState(false);
  const [days, setDays] = useState(1);
  const user = useAuth();

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInBusinessDays(date.to, date.from);

      setDays(dayCount);

      if (dayCount && room.roomPrice) {
        if (includeBreakFast && room.breakFastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakFastPrice
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      } else {
        setTotalPrice(room?.roomPrice);
      }
    }
  }, [date, room.roomPrice, includeBreakFast]);

  const pathname = usePathname();
  const router = useRouter();

  const isHotelDetailsPage = pathname.includes(`hotel-details`);
  const isBookRoom = pathname.includes("book-room");

  const disableDates = useMemo(() => {
    let dates: Date[] = [];

    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.id && booking.paymentStatus
    );

    roomBookings.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });

      dates = [...dates, ...range];
    });
    return dates;
  }, [bookings]);

  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleRoomDelete = (room: Room) => {
    setIsLoading(true);
    const imagekey = room.image.substring(room.image.lastIndexOf("/") + 1);
    // console.log("ImageKey", imagekey);
    axios
      //   .post("/api/uploadthing/delete", { imagekey })
      .delete(`/api/uploadthing/delete/${imagekey}`)
      .then(() =>
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: "success",
              description: "Room deleted!",
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: `Room deletion could not be completed! {$error}`,
            });
          })
      )
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: `Room deletion could not be completed! {$error}`,
        });
      });
  };

  const handleBookRoom = () => {
    const userId = user.userId;

    if (!userId)
      return toast({
        variant: "destructive",
        description: "Ooops! Make sure you are logged in.",
      });

    if (!hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong, refresh the page and try again!",
      });

    if (date?.from && date?.to) {
      setBookingIsLoading(true);

      const bookingRoomData = {
        room,
        totalPrice,
        breakFastIncluded: includeBreakFast,
        startDate: date.from,
        endDate: date.to,
      };

      setRoomData(bookingRoomData);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastIncluded: includeBreakFast,
            totalPrice: totalPrice,
          },
          payment_intent_id: paymentIntentId,
        }),
      })
        .then((res) => {
          setBookingIsLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }
          return res.json();
        })
        .then((data) => {
          console.log("dataTG", data);
          setClientSecret(data.paymentIntent.client_secret);
          setPaymentIntentId(data.paymentIntent.id);
          router.push("/book-room");
        })
        .catch((error: any) => {
          console.log("Error:", error);
          toast({
            variant: "destructive",
            description: `ERROR! $(error.message)`,
          });
        });
    } else {
      toast({
        variant: "destructive",
        description: "Ooops! Select Date",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" /> {room.bedCount} Bed{`(s)`}
          </AmenityItem>
          <AmenityItem>
            <Bed className="h-4 w-4" /> {room.guestCount} Guest{`(s)`}
          </AmenityItem>
          <AmenityItem>
            <Bed className="h-4 w-4" /> {room.bathroomCount} Bathroom{`(s)`}
          </AmenityItem>
          {!!room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-w" /> {room.kingBed} King Bed{`(s)`}
            </AmenityItem>
          )}
          {!!room.queenBed && (
            <AmenityItem>
              <Bed className="h-4 w-w" /> {room.queenBed} Queen Bed{`(s)`}
            </AmenityItem>
          )}
          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-w" /> Room Services
            </AmenityItem>
          )}
          {room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-w" /> TV
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-w" /> Balcony
            </AmenityItem>
          )}
          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-w" /> Wifi
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-w" /> City view
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-w" /> Ocean view
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-w" /> Forest View
            </AmenityItem>
          )}
          {room.mountainView && (
            <AmenityItem>
              <MountainSnow className="h-4 w-w" /> Mountain View
            </AmenityItem>
          )}
          {room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-w" /> Air Condition
            </AmenityItem>
          )}
          {room.soundProofed && (
            <AmenityItem>
              <VolumeX className="h-4 w-w" /> Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between">
          <div>
            Room Price: <span> ${room.roomPrice}</span>{" "}
            <span className="text-xs">/24hrs</span>
            {!!room.breakFastPrice && (
              <div>
                Breakfast Price:
                <span className="font-bold">${room.breakFastPrice}</span>
              </div>
            )}
          </div>
        </div>
        <Separator />
      </CardContent>
      {!isBookRoom && (
        <CardFooter>
          {isHotelDetailsPage ? (
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-2">
                  Select days that you will spend in this room
                </div>
                <DatePickerWithRange
                  date={date}
                  setDate={setDate}
                  disabledDates={disableDates}
                />
              </div>

              {room.breakFastPrice > 0 && (
                <div>
                  <div className="mb-2">
                    Do you want to be served a breakfast each day
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="breakfast"
                      onCheckedChange={(value) => setIncludeBreakFast(!!value)}
                    />
                    <label htmlFor="breakfast" className="text-sm">
                      Include BreakFast
                    </label>
                  </div>
                </div>
              )}
              <div>
                Total Price: <span className="font-bold">${totalPrice}</span>{" "}
                for <span className="font-bold">{days} Days</span>
              </div>
              <Button
                onClick={() => handleBookRoom()}
                disabled={bookingIsLoading}
                type="button"
              >
                {bookingIsLoading ? (
                  <Loader2 className="mr-2 s-4" />
                ) : (
                  <Wand2 className="mr-2 s-4" />
                )}
                {bookingIsLoading ? "Loading..." : "Book Room"}
              </Button>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <Button
                disabled={isLoading}
                type="button"
                variant="ghost"
                onClick={() => handleRoomDelete(room)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    className="max-w-[150px]"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Update Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[900px] w-[90%]">
                  <DialogHeader className="px-2">
                    <DialogTitle>Update Room?</DialogTitle>
                    <DialogDescription>
                      Make changes to this room.
                    </DialogDescription>
                  </DialogHeader>
                  <AddRoomForm
                    hotel={hotel}
                    room={room}
                    handleDialogueOpen={handleDialogueOpen}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RoomCard;
