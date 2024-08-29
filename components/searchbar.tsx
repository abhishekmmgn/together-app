import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type PropsType = {
  searchActive: boolean;
  setSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder: string;
};

export default function SearchBar(props: PropsType) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const pathname = usePathname();

  function handleKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (searchTerm) {
        props.setSearchActive(false);
        router.push(`${pathname}?query=${searchTerm}`);
      }
    } else {
      const term = (e.target as HTMLInputElement).value.toLowerCase();
      setSearchTerm(term);
    }
  }

  return (
    <div className="sticky inset-x-0 z-40 px-5 py-4 bg-background backdrop-filter backdrop-blur-xl bg-opacity-80 flex gap-4 items-center justify-between sm:top-14 lg:px-0 group">
      <div className="relative w-full group">
        <Input
          type="search"
          defaultValue={searchTerm}
          placeholder={props.placeholder}
          onFocus={() => props.setSearchActive(true)}
          onKeyDown={handleKeydown}
          className="bg-secondary"
        />
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
