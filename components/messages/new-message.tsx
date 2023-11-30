import { Button } from "../ui/button";
import { IoPencilOutline } from "react-icons/io5";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewMessage() {
  return (
    <div className="fixed bottom-10 right-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="h-10 ">
            <IoPencilOutline className="w-5 h-5 mr-1" />
            <span className="text-sm">New Message</span>
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
