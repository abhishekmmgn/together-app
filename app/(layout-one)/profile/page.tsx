import Navbar from "@/components/navbar";
import OrgProfileCard from "./org-profile-card";
import ProfileCard from "./profile-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const isUser = false;
  return (
    <>
      <Navbar title="Profile" />
      {isUser ? <ProfileCard last={true} /> : <OrgProfileCard last={true} />}
      <Separator />
      <div className="w-full h-16 flex items-center px-5 gap-4 bg-background hover:bg-muted hover:dark:bg-muted justify-between">
        <p className="font-medium">Organizations Following</p>
        <p className="text-primary">12</p>
      </div>
      <Separator />
      {!isUser && (
        <>
          <div className="w-full h-16 flex items-center px-5 gap-4 bg-background hover:bg-muted hover:dark:bg-muted justify-between">
            <p className="font-medium">Followers</p>
            <p className="text-primary">12K</p>
          </div>
          <Separator />
        </>
      )}
      <div className="py-1 px-5 bg-background dark:bg-background">
        <Button variant="secondary" className="mx-auto">
          Sign Out
        </Button>
      </div>
    </>
  );
}
