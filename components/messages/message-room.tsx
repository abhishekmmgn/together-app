import { Message } from "@/components/messages/message";
import { useEffect, useRef, useState } from "react";
import { ActiveConversationType, MessageObject } from "@/types";
import {
  getConversation,
  searchConversation,
} from "@/lib/conversation-helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoArrowUpCircle } from "react-icons/io5";
import { createConversation, sendMessage } from "@/lib/conversation-helpers";
import { IoChevronBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatAvatarName from "@/lib/formatAvatarName";

type propsType = {
  activeConversation: ActiveConversationType;
  setActiveConversation: React.Dispatch<
    React.SetStateAction<ActiveConversationType>
  >;
};

let socket: WebSocket;

export default function MessageRoom(props: propsType) {
  const [userDetails, setUserDetails] = useState({
    _id: "",
    name: "",
    profilePhoto: "",
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [newMessages, setNewMessages] = useState<MessageObject[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Set websocket connection
  useEffect(() => {
    socket = new WebSocket("ws://localhost:3001", ["json"]);
    socket.addEventListener("open", (event) => {
      console.log("🟢, WebSocket connection opened", event);
    });
    socket.addEventListener("close", (event) => {
      console.log("🔴, WebSocket connection closed", event);
    });
    // listen for messages
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      setMessages(data.msg);
      console.log("Received message:", data);
    });

    return () => {
      socket.close();
      console.log("🔴, Closed");
    };
  });

  useEffect(() => {
    const getData = async () => {
      let data;
      if (props.activeConversation.conversationId.length > 1) {
        data = await getConversation(props.activeConversation.conversationId);
      } else if (props.activeConversation.otherUserId) {
        data = await searchConversation(props.activeConversation.otherUserId);
        props.setActiveConversation({
          conversationId: data[2],
          otherUserId: data[0]._id,
        });
      }
      setUserDetails({
        _id: data[0]._id,
        name: data[0].name,
        profilePhoto: data[0].profilePhoto,
      });
      setMessages(data[1]);
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = await getConversation(
        props.activeConversation.conversationId
      );
      props.setActiveConversation({
        conversationId: data[2],
        otherUserId: data[0]._id,
      });
    };
    if (newMessages.length === 1 && messages.length == 0) {
      getData();
    }
  }, [newMessages]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.send(JSON.stringify({
      user: userDetails._id,
      text: message,
      time: Date.now()
    }));

    if (props.activeConversation.conversationId.length > 1) {
      await sendMessage(message, props.activeConversation.conversationId);
    } else {
      await createConversation(message, userDetails._id);
    }
    setMessage("");
  }

  // Reverse scroll, adjust scroll position
  useEffect(() => {
    // alert("Fired")
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [newMessages, messages]);
  return (
    <div className="h-screen bg-background">
      <div className="w-full fixed z-50 top-0 inset-x-0 bg-background pt-4 backdrop-filter backdrop-blur-xl bg-opacity-90 sm:top-14 sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl sm:inset-x-auto">
        <div
          onClick={() =>
            props.setActiveConversation({
              conversationId: "",
              otherUserId: "",
            })
          }
        >
          <IoChevronBack className="w-6 h-6 text-tertiary-foreground absolute left-2 top-10 cursor-pointer sm:top-8" />
        </div>

        <div className="w-full flex flex-col gap-1 items-center justify-center">
          <Avatar className="w-11 h-11">
            <AvatarImage
              src={userDetails.profilePhoto}
              alt={userDetails.name}
            />
            <AvatarFallback>
              {formatAvatarName(userDetails.name)}
            </AvatarFallback>
          </Avatar>
          <h1 className="line-clamp-1 text-sm font-medium">
            {userDetails.name}
          </h1>
        </div>
      </div>
      <div
        className="fixed top-24 bottom-16 inset-x-0 px-3 py-2 space-y-3 overflow-x-scroll sm:inset-x-auto sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl sm:top-36 no-scrollbar"
        ref={messagesContainerRef}
      >
        {/* <div className="space-y-3"> */}
        {messages.map((message, index) => {
          const firstKey = Object.keys(message)[0];
          const messageContent: string = message[firstKey];
          return firstKey === userDetails._id ? (
            <Message message={messageContent} type="received" key={index} />
          ) : (
            <Message message={messageContent} type="sent" key={index} />
          );
        })}
        {newMessages.map((message, index) => {
          const firstKey: string = Object.keys(message)[0];
          const messageContent: string = message[firstKey];
          return firstKey === userDetails._id ? (
            <Message message={messageContent} type="received" key={index} />
          ) : (
            <Message message={messageContent} type="sent" key={index} />
          );
        })}
        {/* </div> */}
      </div>
      <div className="fixed bottom-0 inset-x-0 p-3 bg-background sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl sm:inset-x-auto sm:mx-auto lg:px-0">
        <form className="pb-2 flex gap-3" onSubmit={handleSubmit}>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="bg-secondary"
          />
          <Button
            size="icon"
            variant="ghost"
            type="submit"
            disabled={message.length === 0}
            className="w-12 hover:bg-transparent"
          >
            <IoArrowUpCircle className="w-7 h-7 text-primary" />
          </Button>
        </form>
      </div>
    </div>
  );
}
