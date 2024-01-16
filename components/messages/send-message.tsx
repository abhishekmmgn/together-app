import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoArrowUpCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import {
  createConversation,
  sendMessage,
} from "@/helpers/conversation-helpers";
import { MessageObject } from "@/types";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function SendMessage({
  setNewMessages,
  userId,
  conversationId,
}: {
  setNewMessages: React.Dispatch<React.SetStateAction<MessageObject[]>>;
  userId: string;
  conversationId: string;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Define the event handler function outside of the effect
    const handleMessage = (data: string) => {
      setNewMessages((prev) => [...prev, { me: data }]);
    };

    // Listen for the "message" event from the server
    socket.on("message", handleMessage);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Emit the "new-message" event with the message content
    socket.emit("new-message", message);

    if (conversationId.length > 1) {
      await sendMessage(message, conversationId);
    } else {
      await createConversation(message, userId);
    }
    setMessage("");
  }
  return (
    <div className="fixed bottom-0 inset-x-0 p-3 bg-background  sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl sm:inset-x-auto sm:mx-auto lg:px-0">
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
  );
}
