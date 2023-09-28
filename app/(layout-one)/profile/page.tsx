import Link from "next/link";
import Navbar from "@/components/navbar";
import OrgProfileCard from "./org-profile-card";
import ProfileCard from "./profile-card";
import { Separator } from "@/components/ui/separator";
import Post from "../post/post";
import EventPost from "../post/event-post";
import TableRow from "@/components/table-row";

export default function ProfilePage() {
  const isUser = true;
  return (
    <>
      <Navbar title="Profile" />
      <div className="pb-4">
        {isUser ? <ProfileCard last={true} /> : <OrgProfileCard last={true} />}
        <Separator />
        <div className="w-full h-16 flex items-center px-5 gap-4  hover:bg-muted lg:px-0">
          <p className="font-medium">Organizations Following</p>
          <p className="text-primary">12</p>
        </div>
        <Separator />
        {!isUser && (
          <>
            <div className="w-full h-16 flex items-center px-5 gap-4  hover:bg-muted lg:px-0">
              <p className="font-medium">Followers</p>
              <p className="text-primary">12K</p>
            </div>
            <Separator />
          </>
        )}
        {isUser ? (
          <div className="pt-6 px-5 lg:px-0 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-2xl">Activity</h2>
              <Link href="/explore">
                <p className="text-primary text-sm">See All</p>
              </Link>
            </div>
            <Post paddingX={true} />
          </div>
        ) : (
          <div className="pt-6 px-5 space-y-4 lg:px-0">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-2xl">Posts</h1>
                <Link href="/explore">
                  <p className="text-primary text-sm">See All</p>
                </Link>
              </div>
              <div>
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
              <div>
                <EventPost paddingX={true} />
                <Separator />
              </div>
            </div>
          </div>
        )}
        <Link href="/settings">
          <TableRow title="Settings" textColor={false} />
        </Link>
      </div>
    </>
  );
}
