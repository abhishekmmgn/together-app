import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type propsType = {
  comment: string;
};

export function CommentRecieved(props: propsType) {
  return (
    <div className="flex gap-2">
      <Avatar className="w-9 h-9 rounded-full">
        <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-fit max-w-[75%] py-[6px] px-[12px] rounded-lg bg-[#f2f2f2]">
        <p className="font-medium text-sm capitalize">name</p>
        <p className="text-sm+">{props.comment}</p>
      </div>
    </div>
  );
}

export function CommentSent(props: propsType) {
  return (
    <div className="flex gap-2">
      <Avatar className="w-9 h-9 rounded-full">
        <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-fit max-w-[75%] py-[6px] px-[12px] rounded-lg bg-[#007aff] text-white">
        <p className="font-medium text-sm capitalize">name</p>
        <p className="text-sm+">{props.comment}</p>
      </div>
    </div>
  );
}

