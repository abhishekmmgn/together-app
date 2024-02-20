import MessageHeading from "@/components/messages/message-heading";
import { Message } from "@/components/messages/message";
import SendMessage from "@/components/messages/send-message";
import { useEffect, useRef, useState } from "react";
import { ActiveConversationType, MessageObject } from "@/types";
import {
  getConversation,
  searchConversation,
} from "@/lib/conversation-helpers";
import { Socket, io } from "socket.io-client";

type propsType = {
  activeConversation: ActiveConversationType;
  setActiveConversation: React.Dispatch<
    React.SetStateAction<ActiveConversationType>
  >;
};

export default function MessageRoom(props: propsType) {
  const [userDetails, setUserDetails] = useState({
    _id: "",
    name: "",
    profilePhoto: "",
  });
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [newMessages, setNewMessages] = useState<MessageObject[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

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
    if (newMessages.length > 1 && messages.length == 0) {
      getData();
    }
  });

  useEffect(() => {
    const isAtBottom =
      messagesContainerRef.current &&
      messagesContainerRef.current.scrollHeight -
        messagesContainerRef.current.scrollTop ===
        messagesContainerRef.current.clientHeight;

    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, newMessages]);

  return (
    <div className="h-screen absolute inset-0 z-50 bg-background sm:inset-auto sm:static sm:z-auto">
      <MessageHeading
        name={userDetails?.name}
        profilePhoto={userDetails.profilePhoto}
        setActiveConversation={props.setActiveConversation}
      />
      <div className="mt-20 p-3 space-y-3" ref={messagesContainerRef}>
        <>
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
        </>
      </div>
      <div ref={messagesEndRef}></div>
      <SendMessage
        userId={userDetails._id}
        conversationId={props.activeConversation.conversationId}
        setNewMessages={setNewMessages}
      />
    </div>
  );
}
