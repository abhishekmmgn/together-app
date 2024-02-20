import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { PersonProfileType } from "@/types";
import formatAvatarName from "@/lib/formatAvatarName";

export default function ProfileCard(props: PersonProfileType) {
  return (
    <Link href={`/profile/${props._id}`}>
      <div className="w-full h-16 flex items-center gap-3 hover:bg-muted/50">
        <Avatar className="h-12 w-12 aspect-square">
          <AvatarImage src={props.profilePhoto} alt={props.name} />
          <AvatarFallback>
            {formatAvatarName(props.name)}
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <h1 className="w-full font-medium line-clamp-1">{props.name}</h1>
          <p className="w-fit overflow-x-hidden line-clamp-1 text-muted-foreground">
            {props.bio}
          </p>
        </div>
      </div>
      <Separator />
    </Link>
  );
}
