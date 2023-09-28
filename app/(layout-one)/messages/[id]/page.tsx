"use client";

import MessageHeading from "./message-heading";
import { MessageRecieved, MessageSent } from "./message";
import SendMessage from "./send-message";
import Navbar from "@/components/navbar";

export default function MessageRoomPage() {
  return (
    <>
      <div className="hidden sm:block">
        <Navbar title="Messages" />
      </div>
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
    </>
  );
}
