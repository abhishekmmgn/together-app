import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import AvatarGallery from "@/components/profile/avatar-gallery";

export default function OrganizationProfile() {
  return (
    <div className="p-5">
      <div className="grid gap-4 pb-4">
        <Image
          src={"/images/organization.png"}
          alt="Profile Photo"
          width={500}
          height={500}
          className="w-28 aspect-square bg-secondary shadow-sm rounded-md"
        />
        <div>
          <h1 className="-mt-1 font-medium text-2xl md:text-3xl">
            Terry Hanks
          </h1>
          <p className="mb-1 text-tertiary-foreground line-clamp-3">
            DKMS is an international nonprofit where creativity, initiative,
            compassion, collaboration and strategic thinking are rewarded as we
            work together to expand our reach, recruit more bone marrow donors
            and help save more lives. Following the establishment of DKMS, our
            German predecessor, we were founded in 2004 in the U.S. as DKMSne
            marrow and blood stem cell donors for patients in need of a
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <AvatarGallery />
            <p className="font-medium text-primary">12 common friends</p>
          </div>
          {false ? (
            <Button className="mx-auto">Follow</Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="secondary" className="mx-auto">
                Unfollow
              </Button>
              <Button variant="secondary" className="mx-auto">
                Message
              </Button>
            </div>
          )}
        </div>
      </div>
      <Separator />
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <h1 className="font-medium text-2xl">Activity</h1>
          <div className="">
            <Post paddingX={true} />
            <Post paddingX={true} />
            <Post paddingX={true} />
            <Post paddingX={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
