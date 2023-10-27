import { IoPencil } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProfileForm from "@/components/forms/edit-profile";

type propsType = {
  name: string;
  photo: string;
  bio: string;
};
export default function EditProfile(props: propsType) {
  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <IoPencil className="w-5 h-5 text-primary" />
      </DialogTrigger>
      <DialogContent className="h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div>
          <EditProfileForm
            name={props.name}
            photo={props.photo}
            bio={props.bio}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
