"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BsSend } from "react-icons/bs";

export default function SendMessage() {
  return (
    <div className="fixed bottom-0 inset-x-0 p-3 bg-background sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl md:inset-x-auto md:mx-auto lg:px-0">
      <form className="flex gap-3">
        <Input type="text" placeholder="Type a message" />
        <Button size={"icon"} type="submit" className="w-12">
          <BsSend className="w-5 h-5 text-primary-foreground" />
        </Button>
      </form>
    </div>
  );
}
