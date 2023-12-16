import { IoChevronBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import formatAvatarName from "@/helpers/formatAvatarName";

type propsType = {
  userId: string;
  setconversationActive: React.Dispatch<React.SetStateAction<string>>;
};
export default function MessageHeading(props: propsType) {
  const [userData, setUserData] = useState<{
    name: string;
    profilePhoto: string;
  }>({
    name: "",
    profilePhoto: "",
  });

  async function getData() {
    try {
      const res = await fetch(`/api/user/minimum-data/${props.userId}`);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUserData({
          name: data.data[0].name,
          profilePhoto: data.data[0].profilePhoto,
        });
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    }
  }

  useEffect(() => {
    getData();
  });

  return (
    <>
      <div className="w-full fixed z-50 top-0 inset-x-0 bg-background py-2 backdrop-filter backdrop-blur-xl bg-opacity-90 sm:top-14 sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl dark:bg-background md:inset-x-auto">
        <div onClick={() => props.setconversationActive("")}>
          <IoChevronBack className="w-6 h-6 text-tertiary-foreground absolute left-5 top-5 cursor-pointer lg:left-0" />
        </div>

        <div className="w-full flex flex-col gap-1 items-center justify-center">
          <Avatar className="w-11 h-11">
            <AvatarImage src={userData.profilePhoto} alt={userData.name} />
            <AvatarFallback>
              {formatAvatarName(userData.name)}
            </AvatarFallback>
          </Avatar>
          <h1 className="line-clamp-1 text-sm font-medium">{userData.name}</h1>
        </div>
      </div>
    </>
  );
}
