import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { PersonProfileType } from "@/types";
import formatAvatarName from "@/lib/formatAvatarName";

export default function ProfileCard(props: PersonProfileType) {
	return (
		<>
			<div className="w-full h-12 flex items-center gap-3 bg-transparent">
				<Avatar className="h-9 w-9 aspect-square">
					<AvatarImage src={props.profilePhoto} alt={props.name} />
					<AvatarFallback>{formatAvatarName(props.name)}</AvatarFallback>
				</Avatar>
				<div className="w-full">
					<h1 className="w-full font-medium line-clamp-1">{props.name}</h1>
				</div>
			</div>
			<Separator />
		</>
	);
}
