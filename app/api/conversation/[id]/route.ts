import { type NextRequest, NextResponse } from "next/server";
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
    const conversationId = params.id;

    const conversation = await Conversations.findOne({
      _id: conversationId,
    });
    // find the other user by filtering out the current user's id
    const members = conversation.members.filter(
      (memberId: string) => memberId != userId
    );
    // find the other user's details in each conversation and update the conversation
    const otherUser: any = await User.findOne({ _id: members[0] }).select(
      "_id name profilePhoto"
    );
    const data = [otherUser, conversation.messages];

    return NextResponse.json({
      message: "Conversation found",
      data: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const { message } = await request.json();

    const _id = await getDataFromToken(request);

    const conversationId = params.id;
    const conversation = await Conversations.findOne({
      _id: conversationId,
    });

    conversation.messages.push({ [_id]: message });
    await conversation.save();

    return NextResponse.json(
      {
        message: "Updated conversation",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const conversationId = params.id;
    const { otherUserId } = await request.json();

    const _id = await getDataFromToken(request);
    const currentUser = await User.findOne({ _id });

    const userConversations = currentUser.conversations;
    const updatedConversations = userConversations.filter(
      (conversation: any) => {
        const userId = Object.keys(conversation)[0];
        const conversationId = conversation[userId];

        return conversationId !== conversationId;
      }
    );
    currentUser.conversations = updatedConversations;
    await currentUser.save();

    const otherUser = await User.findOne({ _id: otherUserId });
    const otherUserConversations = otherUser.conversations;
    const otherUserUpdatedConversations = otherUserConversations.filter(
      (conversation: any) => {
        const userId = Object.keys(conversation)[0];
        const conversationId = conversation[userId];

        return conversationId !== conversationId;
      }
    );
    otherUser.conversations = otherUserUpdatedConversations;
    await otherUser.save();

    // delete the conversation
    await Conversations.deleteOne({ _id: conversationId });

    return NextResponse.json({
      message: "Conversation deleted",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
