import { Button } from "../ui/button";
import { IoCreateOutline } from "react-icons/io5";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewMessage() {
  return (
    <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="h-10 flex items-center justify-center">
            <IoCreateOutline className="w-6 h-6 mr-1" />
            <span className="text-sm mt-1">New Message</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
        </DialogContent>
        {/* either show all friends or a searchbar and suggestions based on typing */}
      </Dialog>
    </div>
  );
}
