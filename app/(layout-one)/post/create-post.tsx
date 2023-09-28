import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateEventForm from "./create-event-form";
import CreatePostForm from "./create-post-form";

export default function CreatePost() {
  return (
    <div className="h-[70vh] w-[360px]">
      <Tabs defaultValue="post" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="event">Event</TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <CreatePostForm />
        </TabsContent>
        <TabsContent value="event">
          <CreateEventForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
