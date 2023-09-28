import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NotificationsPrefrences from "./notifications-prefrences";
import ChangePassword from "@/app/(layout-one)/settings/change-password";
import ThemeToggle from "@/app/(layout-one)/settings/theme-toggler";

export default function SettingsPage() {
  return (
    <>
      <Navbar title="Settings" />
      <div className="p-4 px-5 space-y-5 lg:px-0">
        <div className="flex justify-between items-center">
          <h3 className="mb-1 text-lg font-medium">Theme</h3>
          <ThemeToggle />
        </div>
        <Separator />
        <NotificationsPrefrences />
        <Separator />
        <ChangePassword />
        <Separator />
        <div>
          <h3 className="mb-1 text-lg font-medium">Sign Out</h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Sign out from current session.
          </p>
          <Button variant="secondary" className="mx-auto mb-5">
            Sign Out of This Devices
          </Button>
          <p className="mb-3 text-sm text-muted-foreground">
            Sign out of all devices and browsers. You will need to sign in again
          </p>
          <Button variant="secondary" className="mx-auto">
            Sign Out of All Devices
          </Button>
        </div>
        <Separator />
        <div>
          <h3 className="mb-1 text-lg font-medium">Delete Account</h3>
          <p className="mb-4 text-sm text-muted-foreground">
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
