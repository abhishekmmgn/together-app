import { Separator } from "./ui/separator";

type PropsType = {
  title: string,
  textColor?: boolean
};
export default function TableRow(props: PropsType) {
  return (
    <>
      <div className={`px-5 w-full h-11 flex items-center justify-between hover:bg-muted dark:hover:bg-muted ${!props.textColor && "text-primary"}`}>
        {props.title}
      </div>
      <div className="px-5">
        <Separator />
      </div>
    </>
  );
}
