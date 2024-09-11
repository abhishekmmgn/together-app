// @ts-expect-error
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function FormButton({ title }: { title: string }) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending && (
				<AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
			)}
			{title}
		</Button>
	);
}
