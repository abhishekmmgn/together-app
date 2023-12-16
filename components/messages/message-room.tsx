import MessageHeading from "@/components/messages/message-heading";
import { MessageRecieved, MessageSent } from "@/components/messages/message";
import SendMessage from "@/components/messages/send-message";
// import io from 'Socket.IO-client'
let socket
import { useEffect } from "react";

type propsType = {
  conversationId: string;
  setconversationActive: React.Dispatch<React.SetStateAction<string>>;
};

export default function MessageRoom(props: propsType) {
  // useEffect(() => socketInitializer(), [])
//   const socketInitializer = async () => {
//     await fetch('/api/socket')
//     socket = io()

//     socket.on('connect', () => {
//       console.log('connected')
//     })
//   }

//   return null
// }
  const messages = [
    { message: "Hello world!", createdAt: Date.now(), createdBy: "curUser" },
    {
      message: "World says hello!",
      createdAt: Date.now(),
      createdBy: "otherUser",
    },
  ];
  const userId = "6564395ac3f69cbaeddce588";
  return (
    <div className="absolute inset-0 z-[100] bg-background md:inset-auto md:static md:z-auto">
      <MessageHeading
        userId={userId}
        setconversationActive={props.setconversationActive}
      />
      <div className="p-3 space-y-5 sm:mt-14">
        <>
          {messages.map((message) => {
            message.createdBy === "curUser" ? (
              <MessageRecieved message="Hey, how can I help you today?" />
            ) : (
              <MessageSent message="Hey, I'm having trouble with my account." />
            );
          })}
        </>
      </div>
      <SendMessage />
    </div>
  );
}
