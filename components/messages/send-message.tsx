"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BsSend } from "react-icons/bs";

export default function SendMessage() {
  return (
    <div className="fixed bottom-0 inset-x-0 p-3  sm:left-[210px] md:left-[232px] xl:left-[248px] m:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl">
      <form className="flex gap-3">
        <Input type="text" placeholder="Type a message" />
        <Button size={"icon"} type="submit" className="w-12">
          <BsSend />
        </Button>
      </form>
    </div>
  );
}
