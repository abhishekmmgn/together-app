import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";
import { useState } from "react";

type PropsType = {
  searchActive: boolean;
  setSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder: string;
};

export default function SearchBar(props: PropsType) {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  function handleKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && searchValue) {
      props.setSearchActive(false);
      router.push(`/explore?query=${searchValue}`);
    }
  }
  return (
    <div className="sticky inset-x-0 z-40 px-5 py-4 bg-background backdrop-filter backdrop-blur-xl bg-opacity-80 flex gap-4 items-center justify-between sm:top-14 lg:px-0">
      <div className="relative w-full">
        <Input
          type="search"
          placeholder={props.placeholder}
          onFocus={() => props.setSearchActive(true)}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeydown}
          className="bg-secondary pl-8"
        />
        <IoSearchOutline className="text-muted-foreground absolute left-2 top-3 w-4 h-4" />
      </div>
      {props.searchActive && (
        <Button
          variant="secondary"
          size="sm"
          className="transform px-0 text-primary bg-background hover:bg-background"
          onClick={() => props.setSearchActive(false)}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
