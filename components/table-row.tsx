import { Separator } from "./ui/separator";

type PropsType = {
  title: string;
  textColor?: boolean;
};
export default function TableRow(props: PropsType) {
  return (
    <>
      <div
        className={`px-5 w-full h-11 flex items-center justify-between hover:bg-muted/60 lg:px-0 ${
          !props.textColor && "text-primary"
        }`}
      >
        <p>{props.title}</p>
      </div>
      <Separator />
    </>
  );
}
