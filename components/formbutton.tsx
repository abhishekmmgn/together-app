import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function FormButton({
	title,
	loadingText,
}: {
	title: string;
	loadingText?: string;
}) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" loading={pending} loadingText={loadingText}>
			{title}
		</Button>
	);
}
