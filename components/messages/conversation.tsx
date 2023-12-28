import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import formatAvatarName from "@/helpers/formatAvatarName";
import { ActiveConversationType, ConversationType } from "@/types";
import formatDate from "@/helpers/formatDate";
import { useState } from "react";

export default function Conversation({
  conversationId,
  lastMessage,
  user,
  setActiveConversation,
}: ConversationType & {
  setActiveConversation: React.Dispatch<
    React.SetStateAction<ActiveConversationType>
  >;
}) {
  const [deleted, setDeleted] = useState(false);
  const unread = 0;
  const formattedTime = formatDate(lastMessage.time);

  if (deleted) return <></>;
  
  return (
    <div
      className="cursor-pointer"
      onClick={() =>
        setActiveConversation({ conversationId, otherUserId: user._id })
      }
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="w-full h-[68px] flex items-center px-5 py-2 gap-4 hover:bg-muted/50 lg:px-0">
            <Avatar className="w-14 h-14">
              <AvatarImage src={user.profilePhoto} alt={user.name} />
              <AvatarFallback>{formatAvatarName(user.name)}</AvatarFallback>
            </Avatar>
            <div className="w-full flex flex-col justify-center items-start">
              <div className="w-full flex items-center justify-between gap-5">
                <h1 className="w-[70%] line-clamp-1 lg:text-base+ font-medium">
                  {user.name}
                </h1>
                <p className="w-[30%] text-right text-sm line-clamp-1 text-muted-foreground">
                  {formattedTime}
                </p>
              </div>
              <div className="w-[calc(100%-32px)] flex items-center justify-between gap-5">
                <p className="w-full line-clamp-1 text-tertiary-foreground">
                  {lastMessage.message}
                </p>
                {unread > 0 && (
                  <div className="w-5 h-5 rounded-full line-clamp-1 text-sm bg-primary text-primary-foreground flex items-center justify-center">
                    {unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Mark as Read</ContextMenuItem>
          <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Separator />
    </div>
  );
}
