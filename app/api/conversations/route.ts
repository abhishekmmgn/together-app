import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import Conversations from "@/models/conversations";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const _id = await getDataFromToken(request);
    const currentUser = await User.findOne({ _id });

    const userConversations = currentUser.conversations;

    if (userConversations.length === 0) {
      return NextResponse.json({
        message: "No conversations found.",
        data: userConversations,
      });
    } else {
      const updatedConversations = await Promise.all(
        userConversations.map(async (conversation: any) => {
          const userId = Object.keys(conversation)[0];
          const conversationId = conversation[userId];

          // get the conversation
          const foundConversation = await Conversations.findOne({
            _id: conversationId,
          });
          // get other user's details
          const otherUser: any = await User.findOne({ _id: userId }).select(
            "name profilePhoto"
          );

          const lastConversation =
            foundConversation.messages[foundConversation.messages.length - 1];
          const lastConversationId = Object.keys(lastConversation)[0];
          const lastMessage = lastConversation[lastConversationId];

          const response = {
            conversationId: conversationId,
            lastMessage: {
              time: foundConversation.updatedAt,
              message: lastMessage,
            },
            user: {
              _id: otherUser._id,
              name: otherUser.name,
              profilePhoto: otherUser.profilePhoto,
            },
          };
          return response;
        })
      );

      return NextResponse.json({
        message: "Conversations found",
        data: updatedConversations,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}