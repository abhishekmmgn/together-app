import { Separator } from "./ui/separator";
import { IoChevronForwardSharp } from "react-icons/io5";

type PropsType = {
	title: string;
	textColor?: boolean;
};
export default function TableRow(props: PropsType) {
	return (
		<>
			<div
				className={`px-5 w-full h-11 flex items-center justify-between lg:px-0 ${
					!props.textColor && "text-primary"
				}`}
			>
				<p>{props.title}</p>
				<IoChevronForwardSharp className="h-5 w-5" />
			</div>
			<Separator />
		</>
	);
}
