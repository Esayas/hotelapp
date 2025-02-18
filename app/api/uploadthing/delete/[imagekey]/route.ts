import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
export async function DELETE(
  req: Request,
  { params }: { params: { imagekey: string } }
) {
  console.log("TG##33");
  try {
    const user = auth();
    const userId = (await user).userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const imageId = params.imagekey;
    console.log("EsayasTG", { imageId });

    try {
      const res = await utapi.deleteFiles(imageId);
      return NextResponse.json(res);
    } catch (error) {
      console.log("error at uploadthing/delete:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  } catch (error: any) {
    // console.log("Error at /api/hotelId DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
