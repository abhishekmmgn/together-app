"use client ";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

type propsType = {
  conversationId: string;
  setconversationActive: React.Dispatch<React.SetStateAction<string>>;
};

export default function Conversation(props: propsType) {
  const unread = 2;
  const date = "Yesterday";
  const message = "Hey, how can I help you today?";
  const user = {
    _id: "1",
    name: "John Doe",
    profilePhoto: "/images/profile-photos/profile-1.jpg",
  };
  // fetch conversation and from there only I'll get the user profile
  return (
    <div
      className="relative cursor-pointer"
      onClick={() => props.setconversationActive(props.conversationId)}
    >
      <div className="w-full h-[68px] flex items-center px-5 py-2 gap-4 hover:bg-muted/50 lg:px-0">
        <Avatar className="w-14 h-14">
          <AvatarImage src={user?.profilePhoto} alt={user?.name} />
          <AvatarFallback>
            {user.name
              ?.split(" ")
              .map((word) => word[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col justify-center items-start">
          <div className="w-full flex items-center justify-between gap-5">
            <h1 className="w-[70%] line-clamp-1 lg:text-base+ font-medium">
              {user?.name}
            </h1>
            <p className="w-[30%] text-right text-sm line-clamp-1 text-muted-foreground">
              {date}
            </p>
          </div>
          <div className="w-[calc(100%-32px)] flex items-center justify-between gap-5">
            <p className="w-full line-clamp-1 text-tertiary-foreground">
              {message}
            </p>
            {unread > 0 && (
              <div className="w-5 h-5 rounded-full line-clamp-1 text-sm bg-primary text-primary-foreground flex items-center justify-center">
                {unread}
              </div>
            )}
          </div>
        </div>
      </div>
      <Menubar className="absolute right-0 top-7 bg-transparent">
        <MenubarMenu>
          <MenubarTrigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#464646"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Mark as Read</MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="text-destructive">Delete</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Separator />
    </div>
  );
}
