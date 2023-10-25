import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type propsType = {
  uid?: string;
};

export default function ProfileCard(props: propsType) {
  return (
    <>
      <div className="w-full h-[68px] flex items-center gap-3 hover:bg-muted/60">
        <Avatar className="h-14 w-14">
          <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <h1 className="w-full font-medium line-clamp-1">Name</h1>
          <p className="w-fit max-w-[50%] overflow-x-hidden line-clamp-1 text-muted-foreground dark:text-[#a1a1a1]">
            bio
          </p>
        </div>
      </div>
      <Separator />
    </>
  );
}
