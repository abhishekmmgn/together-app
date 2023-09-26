import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PropsType = {
  active: boolean,
  handleClick: () => void,
  handleFocus: () => void,
  placeholder: string
};
export default function SearchBar(props: PropsType) {
  return (
    <div className="sticky top-14 inset-x-0 z-40 px-5 py-2 bg-background backdrop-filter backdrop-blur-xl bg-opacity-80 flex gap-4 items-center justify-between dark:bg-background dark:bg-opacity-0 dark:backdrop-blur-0">
      <Input
        type="search"
        placeholder={props.placeholder}
        onFocus={props.handleFocus}
      />
      {props.active && (
        <Button
          variant="ghost"
          size={"sm"}
          className="transform px-0 sm:hidden"
          onClick={props.handleClick}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
