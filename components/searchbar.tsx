import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Check if the pressed key is "Enter"
    if (e.key === "Enter" && searchValue) {
      // If Enter key is pressed and there is a search value, update the URL
      props.setSearchActive(false);
      router.push(`${pathname}?query=${searchValue}`);
    } else {
      // Otherwise, update the search term
      const term = (e.target as HTMLInputElement).value.toLowerCase();
      setSearchValue(term);
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }
  }

  return (
    <div className="sticky inset-x-0 z-40 px-5 py-4 bg-background backdrop-filter backdrop-blur-xl bg-opacity-80 flex gap-4 items-center justify-between sm:top-14 lg:px-0">
      <div className="relative w-full">
        <Input
          type="search"
          defaultValue={searchParams.get("query")?.toString()}
          placeholder={props.placeholder}
          onFocus={() => props.setSearchActive(true)}
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
