import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type propsType = {
  uid?: string;
};

export default function OrgCard(props: propsType) {
  return (
    <div className=" dark:">
      <div className="w-full h-[68px] flex items-center gap-3 hover:bg-muted hover:dark:bg-muted">
        <Avatar className="h-14 w-14">
          <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <h1 className="w-full font-medium line-clamp-1">Waste Warriors</h1>
          <p className="w-fit max-w-[50%] overflow-x-hidden line-clamp-1 text-[#464646] dark:text-[#a1a1a1]">
            We do such things
          </p>
        </div>
      </div>
      <Separator />
    </div>
  );
}
