import { Button } from "../ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import ProfileCardSkeleton from "../explore/profile-card-skeleton";
import ProfileCard from "./profile-card";
import type { ActiveConversationType, PersonProfileType } from "@/types";

const loadingArray = [1, 2, 3, 4, 5];

type PropsType = {
	setActiveConversation: React.Dispatch<
		React.SetStateAction<ActiveConversationType>
	>;
};

export default function NewMessage(props: PropsType) {
	const [friends, setFriends] = useState<PersonProfileType[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	async function getFriends() {
		const response = await fetch("/api/user/friends", {
			cache: "no-cache",
		});
		const data = await response.json();
		setFriends(data.data);
		setLoading(false);
	}
	useEffect(() => {
		getFriends();
	}, []);

	return (
		<div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10">
			<ResponsiveDialog
				open={open}
				onOpenChange={setOpen}
				trigger={
					<Button size="sm" className="h-10">
						New mesage
					</Button>
				}
				title="New Message"
			>
				<Command className="p-0">
					<CommandInput placeholder="Search for friends" />
					<CommandList className="no-scrollbar">
						<CommandEmpty>No friends found.</CommandEmpty>
						<CommandGroup className="mt-1">
							{loading ? (
								<>
									{loadingArray.map((index) => (
										<ProfileCardSkeleton key={index} />
									))}
								</>
							) : (
								<>
									{friends?.map((friend: PersonProfileType) => (
										<CommandItem key={friend._id}>
											<div
												className="w-full hover:cursor-pointer"
												onClick={() => {
													props.setActiveConversation({
														conversationId: "0",
														otherUserId: friend._id,
													});
													setOpen(false);
												}}
											>
												<ProfileCard
													name={friend.name}
													username={friend.username}
													bio={friend.bio}
													profilePhoto={friend.profilePhoto}
													_id={friend._id}
												/>
											</div>
										</CommandItem>
									))}
								</>
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</ResponsiveDialog>
		</div>
	);
}
