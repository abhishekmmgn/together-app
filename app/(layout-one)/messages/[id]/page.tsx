"use client";

import MessageHeading from "@/components/messages/message-heading";
import { MessageRecieved, MessageSent } from "@/components/messages/message";
import SendMessage from "@/components/messages/send-message";

export default function MessageRoomPage() {
  return (
    <div className="absolute inset-y-0 inset-x-0 z-[100] bg-background md:inset-x-auto md:inset-y-auto md:static md:z-auto">
        <MessageHeading />
        <div className="p-3 space-y-5 sm:mt-14">
          <MessageRecieved message="Hey, how can I help you today?" />
          <MessageSent message="Hey, I'm having trouble with my account." />
          <MessageRecieved message="What seems to be the problem?" />
          <MessageSent message="I can't log in." />
          <MessageRecieved message="Hey, how can I help you today?" />
          <MessageSent message="Hey, I'm having trouble with my account." />
          <MessageRecieved message="What seems to be the problem?" />
          <MessageSent message="I can't log in." />
          <MessageRecieved message="Hey, how can I help you today?" />
          <MessageSent message="Hey, I'm having trouble with my account." />
          <MessageRecieved message="What seems to be the problem?" />
          <MessageSent message="I can't log in." />
        </div>
        <SendMessage />
    </div>
  );
}
