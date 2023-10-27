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
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteAccountComponent() {
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);

  async function delteAccount() {
    setDisabled(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast.success("Account deleted successfully");
        console.log("Account deleted successfully");
        router.push("/auth/register");
      } else if (res.status === 400) {
        console.log("Invalid _id");
        toast.error("Something went wrong. Try again.");
      } else if (res.status === 500) {
        toast.error("Server error");
        console.log("Server error");
      }
    } catch (err: any) {
      toast.error(err.message);
      console.log("Error: ", err.message);
    } finally {
      setDisabled(false);
    }
  }
  return (
    <>
      <Toaster />
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
              <Button type="submit" variant="destructive" disabled={disabled}>
                {disabled && (
                  <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                )}Z
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
