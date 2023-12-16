import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoArrowUpCircle } from "react-icons/io5";
import { useState } from "react";

export default function SendMessage() {
  const [message, setMessage] = useState("");

  function sendMessage(e) {
    e.prevent.default();
    // socket.emit('input-change', e.target.value)

    // add message to chatroom's message
  }
  return (
    <div className="fixed bottom-2 inset-x-0 p-3 bg-background sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl md:inset-x-auto md:mx-auto lg:px-0">
      <form className="flex gap-3" onSubmit={sendMessage}>
        <Input
          type="text"
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
