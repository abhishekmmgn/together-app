import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarGallery() {
  return (
    <div className="flex shadow-sm">
      <Avatar className="h-11 w-11 shadow-sm">
        <AvatarImage src="picsum.photos/200/300" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="h-11 w-11 -ml-7 -z-[1] shadow-sm">
        <AvatarImage src="picsum.photos/200/300" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="h-11 w-11 -ml-8 -z-[2]">
        <AvatarImage src="picsum.photos/200/300" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
