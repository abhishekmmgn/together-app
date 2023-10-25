import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PropsType = {
  active: boolean,
  handleClick: () => void;
  handleFocus: () => void;
  placeholder: string;
};
export default function SearchBar(props: PropsType) {
  return (
    <div className="z-40 px-5 py-4 bg-white backdrop-filter backdrop-blur-xl bg-opacity-80 flex gap-4 items-center justify-between sm:top-14 lg:px-0 dark:bg-background">
      <Input
        type="search"
        placeholder={props.placeholder}
        onFocus={props.handleFocus}
      />
      {props.active && (
        <Button
          variant="secondary"
          size={"sm"}
          className="transform px-0 bg-background hover:bg-background"
          onClick={props.handleClick}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
