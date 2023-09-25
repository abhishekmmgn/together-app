"use client";
import MessageHeading from "./message-heading";
import { MessageRecieved, MessageSent } from "./messages";
import SendMessage from "./send-message";

export default function MessageRoomPage() {
  return (
    <div className="h-full">
      <MessageHeading />
      <div className="p-3 space-y-5">
        <MessageRecieved message="Hey, how can I help you today?" />
        <MessageSent message="Hey, I'm having trouble with my account." />{" "}
        <MessageRecieved message="What seems to be the problem?" />
        <MessageSent message="I can't log in." />
      </div>
      <SendMessage />
    </div>
  );
}
