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
import Post from "./post";
import { CommentSent, CommentRecieved } from "./comment";
import CreateComment from "./create-comment";

export default function NewPost() {
  return (
    <div className="fixed bottom-10 right-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="h-10 ">
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
    </div>
  );
}
