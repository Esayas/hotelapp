import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { booking, payment_intent_id } = body;

  console.log("booking", { booking });
  console.log("payment_intent_id", { payment_intent_id });

  const bookingData = {
    ...booking,
    userName: user.firstName,
    userEmail: user.emailAddresses[0].emailAddress,
    userId: user.id,
    currency: "USD",
    paymentIntentId: payment_intent_id,
  };

  console.log("bookingData", { bookingData });

  let foundBooking;

  if (payment_intent_id) {
    foundBooking = await prismadb.booking.findUnique({
      where: { paymentIntentId: payment_intent_id, userId: user.id },
    });
  }

  if (foundBooking && payment_intent_id) {
    //update
  } else {
    //create
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalPrice * 100,
      currency: bookingData.currency,
      automatic_payment_methods: { enabled: true },
    });

    bookingData.paymentIntentId = paymentIntent.id;

    await prismadb.booking.create({
      data: bookingData,
    });

    return NextResponse.json({ paymentIntent });
  }

  return new NextResponse("Internal Server Error", { status: 500 });
}
