"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoPencil } from "react-icons/io5";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import EditProfileForm from "@/components/profile/edit-profile-form";
import formatAvatarName from "@/lib/formatAvatarName";
import LoadingSkeleton from "@/components/loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { ShortErrorInfo } from "@/components/error-info";

export default function ProfileCard() {
	const { isPending, error, data, isError } = useQuery<{
		_id: string;
		name: string;
		profilePhoto: string;
		bio: string;
	}>({
		queryKey: ["user-profile"],
		queryFn: async () => {
			const res = await fetch("/api/user");
			if (res.ok) {
				const data = await res.json();
				return data.data;
			}
		},
		staleTime: 1000 * 60 * 5,
	});
	console.log(data);
	if (isPending) {
		return (
			<div className="p-5 lg:px-0">
				<LoadingSkeleton />
			</div>
		);
	}

	if (isError) {
		console.log(error);
		return <ShortErrorInfo />;
	}
	return (
		<>
			<div className="w-full h-[72px] px-5 flex items-center justify-between lg:px-0 md:h-[76px]">
				<div className="w-full flex gap-3">
					<Avatar className="w-14 h-14 lg:w-[60px] lg:h-[60px]">
						<AvatarImage
							src={data.profilePhoto}
							alt="Your Profile profilePhoto"
						/>
						<AvatarFallback className="text-primary lg:text-xl">
							{formatAvatarName(data.name)}
						</AvatarFallback>
					</Avatar>
					<div className="w-full flex flex-col justify-center items-center">
						<h1 className="w-full overflow-x-hidden line-clamp-1 text-lg font-medium">
							{data.name}
						</h1>
						<p className="w-full overflow-x-hidden text-sm line-clamp-1 text-tertiary-foreground">
							{data.bio}
						</p>
					</div>
				</div>
				<div className="size-8 hover:bg-primary/20 grid place-items-center rounded-full">
					<Dialog>
						<DialogTrigger className="w-full">
							<IoPencil className="size-5 hover:text-primary cursor-pointer" />
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Profile</DialogTitle>
							</DialogHeader>
							<div>
								<EditProfileForm photo={data.profilePhoto} bio={data.bio} />
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</>
	);
}
