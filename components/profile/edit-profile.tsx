import { IoPencil } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateProfileForm from "@/app/(layout-two)/create-profile/create-profile-form";

export default function EditProfile() {
  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <IoPencil className="w-5 h-5 text-primary" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div>
          <CreateProfileForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
