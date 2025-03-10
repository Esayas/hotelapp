import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  const authcon = auth();

  const userId = (await authcon).userId;
  console.log("imagekeyreq333", req.json());

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { imagekey } = await req.json();
  console.log("imagekey3", imagekey);
  try {
    const res = await utapi.deleteFiles(imagekey);
    return NextResponse.json(res);
  } catch (error) {
    console.log("error at uploadthing/delete:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
  // const newUrl = "wTZHhleFtekoFhsmSgFLxtJU9uNj5Rzmc0b3nl2TyqfiKeA6";
  // await utapi.deleteFiles(newUrl);
}
