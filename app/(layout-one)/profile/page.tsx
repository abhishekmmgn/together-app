import Link from "next/link";
import Navbar from "@/components/navbar";
import OrgProfileCard from "../../../components/profile/org-profile-card";
import ProfileCard from "@/components/profile/profile-card";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/posts/post";
import EventPost from "@/components/posts/event-post";
import TableRow from "@/components/table-row";

export default function ProfilePage() {
  const isUser = false;
  return (
    <>
      <Navbar title="Profile" />
      <div className="pb-4 z">
        {isUser ? <ProfileCard last={true} /> : <OrgProfileCard last={true} />}
        <Separator />
        <div className="w-full h-16 flex items-center px-5 gap-4  hover:bg-muted">
          <p className="font-medium">Organizations Following</p>
          <p className="text-primary">12</p>
        </div>
        <Separator />
        {!isUser && (
          <>
            <div className="w-full h-16 flex items-center px-5 gap-4  hover:bg-muted ">
              <p className="font-medium">Followers</p>
              <p className="text-primary">12K</p>
            </div>
            <Separator />
          </>
        )}
        <div className="pt-6 px-5 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h1 className="font-medium text-2xl">Posts</h1>
              <Link href="/explore">
                <p className="text-primary text-sm">See All</p>
              </Link>
            </div>
            <div className="">
              <Post paddingX={true} />
              <Separator />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h1 className="font-medium text-2xl">Events</h1>
              <Link href="/explore">
                <p className="text-primary text-sm">See All</p>
              </Link>
            </div>
            <div className="">
              <EventPost paddingX={true} />
              <Separator />
            </div>
          </div>
        </div>
        <Link href="/settings">
          <TableRow title="Settings" textColor={false} />
        </Link>
      </div>
    </>
  );
}
