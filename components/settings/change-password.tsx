import { IoIosArrowForward } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ResetPasswordForm from "@/app/auth/reset-password/reset-password-form";

export default function ChangePassword() {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <div className="w-full flex items-center justify-between">
            <h3 className="text-lg font-medium">Change Password</h3>
            <IoIosArrowForward className="h-5 w-5" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div>
            <ResetPasswordForm userId={""} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
