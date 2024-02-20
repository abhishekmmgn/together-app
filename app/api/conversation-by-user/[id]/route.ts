import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import Conversations from "@/models/conversations";
import { getDataFromToken } from "@/lib/getDataFromToken";

type Params = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const userId = await getDataFromToken(request);
    const otherUserId = params.id;

    const currentUser: any = await User.findOne({ _id: userId });
    const foundConversation = currentUser.conversations.find(
      (conversation: any) => {
        return conversation[otherUserId];
      }
    );

    let messages: any[] = [];
    if (foundConversation) {
      const conversationId = (foundConversation as Record<string, string>)[
        otherUserId
      ];
      if (conversationId) {
        const conversation: any = await Conversations.findOne({
          _id: conversationId,
        });
        messages = conversation.messages;
      }
    }

    const otherUser: any = await User.findOne({ _id: otherUserId }).select(
      "_id name profilePhoto"
    );

    return NextResponse.json({
      message: "Success.",
      data: [otherUser, messages, "0"],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const currentUserId = await getDataFromToken(request);
    const currentUser = await User.findOne({ _id: currentUserId });
    const { message } = await request.json();

    const otherUserId = params.id;
    const otherUser = await User.findOne({ _id: otherUserId });

    const conversation = new Conversations({
      members: [currentUserId, otherUserId],
      messages: [{ [currentUserId]: message }],
    });

    const savedConversation = await conversation.save();

    currentUser.conversations.push({ [otherUserId]: savedConversation._id });
    otherUser.conversations.push({ [currentUserId]: savedConversation._id });

    await currentUser.save();
    await otherUser.save();

    console.log("Works.");
    return NextResponse.json(
      {
        message: "Conversation created.",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
