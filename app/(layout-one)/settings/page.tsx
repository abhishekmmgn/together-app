import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NotificationsPrefrences from "@/components/settings/notifications-prefrences";
import ChangePassword from "@/components/settings/change-password";
import ThemeToggle from "@/components/settings/theme-toggler";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  function logout() {}
  return (
    <>
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
          <p className="mb-3 text-sm text-muted-foreground">Sign out of your current session</p>
          <Dialog>
            <DialogTrigger className="w-full" asChild>
              <Button variant="secondary" className="mx-auto">
                Sign Out
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign Out</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" variant="secondary">
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Separator />
        <div>
          <h3 className="mb-1 text-lg font-medium">Delete Account</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Deleting your account will: Delete your profile, along with your
            authentication associations. Delete any and all content you have,
            such as posts, comments, or your messages.
          </p>
          <Dialog>
            <DialogTrigger className="w-full" asChild>
              <Button
                variant="destructive"
                className="mx-auto"
              >
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" variant="destructive">
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
