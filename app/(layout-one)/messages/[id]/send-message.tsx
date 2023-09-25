"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BsSend } from "react-icons/bs";

export default function SendMessage() {
  return (
    <div className="absolute bottom-0 inset-x-0 p-3">
      <form className="flex gap-3">
        <Input type="text" placeholder="Type a message" />
        <Button size={"icon"} type="submit" className="w-12">
          <BsSend />
        </Button>
      </form>
    </div>
  );
}
