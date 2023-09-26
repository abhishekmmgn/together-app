import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Back from "@/components/back";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import OrgCard from "../../explore/org-card";
import Post from "@/components/post";
import EventPost from "@/components/event-post";

export default function OrganizationProfile() {
  return (
    <>
      <div className="hidden md:block">
        <Navbar title="Together" />
      </div>
      <Back />
      <div>
        <Image
          src={"/images/organization.png"}
          alt="Cover Photo"
          width={500}
          height={500}
          className="w-full aspect-[7/3] bg-secondary"
        />
        <Image
          src={"/images/organization.png"}
          alt="Profile Photo"
          width={500}
          height={500}
          className="ml-5 -mt-10 w-[100px] aspect-square bg-secondary"
        />
        <div className="px-5">
          <div className="py-4 space-y-4">
            <div>
              <h1 className="font-medium text-3xl md:text-4xl">DKMS US</h1>
              <p className="-mt-1 text-[#464646]">We Delete Blood Cancer</p>
            </div>
            <div className="space-y-2">
              <Button className="mx-auto">Follow</Button>
              <Separator />
            </div>
            <div>
              <h1 className="font-medium space-y-[2px]">About</h1>
              <p className="text-[#464646] line-clamp-6">
                DKMS is an international nonprofit where creativity, initiative,
                compassion, collaboration and strategic thinking are rewarded as
                we work together to expand our reach, recruit more bone marrow
                donors and help save more lives. Following the establishment of
                DKMS, our German predecessor, we were founded in 2004 in the
                U.S. as DKMS Americas, and since renamed DKMS. With the firm
                belief that people everywhere can play an active role in saving
                the lives of others with blood cancers and blood and bone marrow
                disorders, our mission is to grow the number of suitable bone
                marrow and blood stem cell donors for patients in need of a
              </p>
            </div>
            <div>
              <h1 className="font-medium space-y-[2px]">Email</h1>
              <p className="text-[#464646]">support@dkms.org</p>
            </div>
            <div>
              <h1 className="font-medium space-y-[2px]">Website</h1>
              <p className="text-[#464646]">www.dkms.org/uk</p>
            </div>
            <div>
              <h1 className="font-medium space-y-[2px]">Location Served</h1>
              <p className="text-[#464646]">United Kingdom</p>
            </div>
            <div>
              <h1 className="font-medium space-y-[2px]">Category</h1>
              <p className="text-[#464646]">Non Profit</p>
            </div>
          </div>
          <Separator />

          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-2xl md:text-3xl">
                  Activity
                </h1>
                <Link href="/explore">
                  <p className="text-primary text-sm">See All</p>
                </Link>
              </div>
              <div className="">
                <Post />
                <Separator />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-2xl md:text-3xl">
                  Recent Events
                </h1>
                <Link href="/explore">
                  <p className="text-primary text-sm">See All</p>
                </Link>
              </div>
              <div className="">
                <EventPost />
                <Separator />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-2xl md:text-3xl">
                  Similar Organizations
                </h1>
                <Link href="/explore">
                  <p className="text-primary text-sm">See All</p>
                </Link>
              </div>
              <div className="">
                <OrgCard />
                <OrgCard />
                <OrgCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
