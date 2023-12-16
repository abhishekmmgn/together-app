import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatAvatarName from "@/helpers/formatAvatarName";

type propsType = {
  type: "sent" | "recieved";
  comment: string;
  createdBy: {
    _id: string;
    name: string;
    profilePhoto: string;
  };
};

export function Comment(props: propsType) {
  return (
    <div className={`flex gap-2 ${props.type === "sent" && "justify-end"}`}>
      {props.type === "recieved" && (
        <Avatar className="w-9 h-9 rounded-full">
          <AvatarImage src={props.createdBy.profilePhoto} alt="Profile photo" />
          <AvatarFallback>
            {formatAvatarName(props.createdBy.name)}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`w-fit max-w-[75%] px-3 py-2 rounded-[var(--radius)] ${
          props.type === "sent" ? "bg-primary" : "bg-secondary"
        }`}
      >
        {props.type === "recieved" && (
          <p className="font-medium text-sm capitalize">name</p>
        )}
        <p className="text-sm+ text-secondary-foreground">{props.comment}</p>
      </div>
    </div>
  );
}
