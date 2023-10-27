import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import EditProfile from "./edit-profile";

type propsType = {
  last?: boolean;
  photo: string;
  name: string;
  bio: string;
};

export default function ProfileCard(props: propsType) {
  return (
    <>
      <div className="w-full h-[72px] px-5 flex items-center justify-between py-2">
        <div className="w-full flex gap-3">
          <Avatar className="w-14 h-14 shadow-sm">
            <AvatarImage src={props.photo} alt="Your Profile photo" />
            <AvatarFallback>{props.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="w-full flex flex-col justify-center items-center">
            <h1 className="w-full overflow-x-hidden line-clamp-1 text-lg font-medium">
              {props.name}
            </h1>
            <p className="w-full overflow-x-hidden text-sm line-clamp-1 text-tertiary-foreground">
              {props.bio}
            </p>
          </div>
        </div>
        <div className="h-8 w-8 hover:bg-primary/20 flex items-center justify-center rounded-full">
          <EditProfile name={props.name} photo={props.photo} bio={props.bio} />
        </div>
      </div>
      {!props.last && <Separator />}
    </>
  );
}
