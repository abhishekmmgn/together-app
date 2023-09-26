import { Separator } from "./ui/separator";

type PropsType = {
  title: string;
};
export default function TableRow(props: PropsType) {
  return (
    <>
      <div className="px-5 w-full h-11 flex items-center justify-between text-primary bg-background dark:bg-background hover:bg-muted dark:hover:bg-muted">
        {props.title}
      </div>
      <div className="px-5">
        <Separator />
      </div>
    </>
  );
}
