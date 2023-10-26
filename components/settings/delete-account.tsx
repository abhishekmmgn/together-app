"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteAccountComponent() {
  return (
    <div>
      <h3 className="mb-1 text-lg font-medium">Delete Account</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Deleting your account will: Delete your profile, along with your
        authentication associations. Delete any and all content you have, such
        as posts, comments, or your messages.
      </p>
      <Dialog>
        <DialogTrigger className="w-full" asChild>
          <Button variant="destructive" className="mx-auto">
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
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
  );
}
