import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import EditProfile from "./edit-profile";

type propsType = {
  last?: boolean;
  uid?: string;
};

export default function ProfileCard(props: propsType) {
  return (
    <>
      <div className="w-full h-[72px] px-5 flex items-center justify-between py-2 hover:bg-muted">
        <div className="w-full flex gap-2">
          <Avatar className="w-14 h-14 shadow-sm">
            <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="w-full flex flex-col justify-center items-center">
            <h1 className="w-full overflow-x-hidden line-clamp-1 text-lg font-medium">
              Terry Banks
            </h1>
            <p className="w-full overflow-x-hidden text-sm line-clamp-1 text-[#3c3c3e] dark:text-[#a1a1a1]">
              banks.terry@icloud.com
            </p>
          </div>
        </div>
        <div className="h-8 w-8 hover:bg-primary/20 flex items-center justify-center rounded-full">
            <EditProfile />
          </div>
      </div>
      {!props.last && <Separator />}
    </>
  );
}
