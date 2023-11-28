import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IoPencil } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProfileForm from "@/components/profile/edit-profile-form";

type propsType = {
  last?: boolean;
  photo: string;
  name: string;
  bio: string;
};

export default function ProfileCard(props: propsType) {
  return (
    <>
      <div className="w-full h-[72px] px-5 flex items-center justify-between lg:px-0 md:h-[76px]">
        <div className="w-full flex gap-3">
          <Avatar className="w-14 h-14 lg:w-[60px] lg:h-[60px]">
            <AvatarImage src={props.photo} alt="Your Profile photo" />
            <AvatarFallback className="text-primary lg:text-xl">
              {props.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")}
            </AvatarFallback>
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
          <Dialog>
            <DialogTrigger className="w-full" asChild>
              <IoPencil className="w-5 h-5 text-primary cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div>
                <EditProfileForm
                  photo={props.photo}
                  bio={props.bio}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {!props.last && <Separator />}
    </>
  );
}
