import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NotificationsPrefrences from "@/components/settings/notifications-prefrences";
import ChangePassword from "@/components/settings/change-password";

export default function SettingsPage() {
  return (
    <>
      <Navbar title="Settings" />
      <div className="p-4 px-5 space-y-5 ">
        <NotificationsPrefrences />
        <Separator />
        <ChangePassword />
        <Separator />
        <div>
          <h3 className="mb-1 text-lg font-medium">Sign Out</h3>
          <p className="mb-3 text-sm text-[#464646]">
            Sign out from current session.
          </p>
          <Button variant="secondary" className="mx-auto mb-5">
            Sign Out of This Devices
          </Button>
          <p className="mb-3 text-sm text-[#464646]">
            Sign out of all devices and browsers. You will need to sign in again
          </p>
          <Button variant="secondary" className="mx-auto">
            Sign Out of All Devices
          </Button>
        </div>
        <Separator />
        <div>
          <h3 className="mb-1 text-lg font-medium">Delete Account</h3>
          <p className="mb-4 text-sm text-[#464646]">
            Deleting your account will: Delete your profile, along with your
            authentication associations. Delete any and all content you have,
            such as posts, comments, or your messages.
          </p>
          <Button variant="destructive" className="mx-auto">
            Delete Account
          </Button>
        </div>
        <Separator />
      </div>
    </>
  );
}
