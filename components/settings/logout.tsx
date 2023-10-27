"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";

export default function LogoutComponent() {
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();

  async function handleLogout() {
    setDisabled(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast.success("Logout successfully");
        router.push("/auth/login");
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
      toast.error(err.message);
    } finally {
      setDisabled(false);
    }
  }
  return (
    <>
      <Toaster />
      <h3 className="mb-1 text-lg font-medium">Sign Out</h3>
      <p className="mb-3 text-sm text-muted-foreground">
        Sign out of your current session
      </p>
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
            <Button
              variant="secondary"
              onClick={handleLogout}
              disabled={disabled}
            >
              {disabled && (
                <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
