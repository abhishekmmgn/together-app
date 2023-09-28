import { Button } from "@/components/ui/button";

export default function EventDetails() {
  return (
    <div className="p-5">
      <div className="mt-2 mb-1">
        <h1 className="font-medium text-lg">2023 TCS London Marathon UK</h1>
        <h2 className="mb-2 font-medium text-primary">by DKMS UK</h2>
        <p className="text-sm text-muted-foreground line-clamp-8 md:mb-3 md:mt-1 md:text-sm+">
          DKMS is an international nonprofit where creativity, initiative,
          compassion, collaboration and strategic thinking are rewarded as we
          work together to expand our reach, recruit more bone marrow donors and
          help save more lives. Following the establishment of DKMS, our German
          predecessor, we were founded in 2004 in the U.S. as DKMS Americas, and
          since renamed DKMS. With the firm belief that people everywhere can
          play an active role in saving the lives of others with blood cancers
          and blood and bone marrow disorders, our mission is to grow the number
          of suitable bone marrow and blood stem cell donors for patients in
          need of a
        </p>
      </div>
      <div className="my-4 space-y-2">
        <div>
          <h1 className="font-medium space-y-[2px]">Date</h1>
          <p className="text-muted-foreground">12 September, 2023</p>
        </div>
        <div>
          <h1 className="font-medium space-y-[2px]">Timings</h1>
          <p className="text-muted-foreground">8am-5pm</p>
        </div>
        <div>
          <h1 className="font-medium space-y-[2px]">Location</h1>
          <p className="text-muted-foreground">London</p>
        </div>
      </div>
      <div className="px-5 py-2 ">
        <Button>Join</Button>
      </div>
    </div>
  );
}
