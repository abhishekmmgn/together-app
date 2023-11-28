import { Button } from "../ui/button";
import { IoAdd } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewPostForm from "./new-post-form";

export default function NewPost() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <IoAdd className="w-5 h-5 mr-1" />
          <span className="text-sm">New Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
        </DialogHeader>
        <NewPostForm />
      </DialogContent>
    </Dialog>
  );
}
