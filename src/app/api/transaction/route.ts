import { Transaction } from "@prisma/client";
import { userReqHandler } from "../../middleware/userReqHandler";
import { TransactionDetails } from "../../services/types";

export const POST = userReqHandler(async (req: NextRequest) => {
    const body = await req.json();
    const details: TransactionDetails = body?.details;

export const POST = userReqHandler(async (req: NextRequest) => {
    const body = await req.json();
    const params = body?.artParams;
  
    try {
      if (!req.user?.id) {
        return NextResponse.json(
          { error: "No User attached to post" },
          { status: 400 }
        );
      }
      const createdArtBlock = await postArtBlockToDb(params, req.user.username);
      return NextResponse.json({ createdArtBlock }, { status: 201 });
    } catch (error) {
      console.error("Error creating ArtBlock:", error);
      return NextResponse.json(
        { error: "Failed to create ArtBlock" },
        { status: 500 }
      );
    }
  });
  