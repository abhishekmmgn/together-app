import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

type propsType = {
  last?: boolean;
  uid?: string;
};

export default function OrgProfileCard(props: propsType) {
  return (
    <div className="py-2  dark: hover:bg-muted hover:dark:bg-muted">
      <div className="w-full h-[72px] flex items-center px-5 py-2 gap-4 lg:px-0">
        <Avatar className="w-14 h-14">
          <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="w-full overflow-x-hidden line-clamp-1 text-lg font-medium">
            DKMS UK
          </h1>
          <p className="w-full overflow-x-hidden text-sm line-clamp-1 text-[#3c3c3e] dark:text-[#a1a1a1]">
            We Delete Blood Cancer
          </p>
        </div>
      </div>
      <div className="px-5 w-full lg:px-0">
        <Button variant="secondary" asChild>
          <Link href="../../(layout-two)/auth/login">Edit Profile</Link>
        </Button>
      </div>
      {!props.last && <Separator />}
    </div>
  );
}
