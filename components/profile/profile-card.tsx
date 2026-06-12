"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoPencil } from "react-icons/io5";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import EditProfileForm from "@/components/profile/edit-profile-form";
import formatAvatarName from "@/lib/formatAvatarName";
import { Button } from "../ui/button";

type ProfileCardProps = {
	_id: string;
	name: string;
	username: string;
	profilePhoto: string;
	bio: string;
};

export default function ProfileCard({
	name,
	username,
	profilePhoto,
	bio,
}: ProfileCardProps) {
	return (
		<div className="w-full h-18 px-5 flex items-center justify-between lg:px-0 md:h-19">
			<div className="w-full flex gap-3">
				<Avatar className="w-14 h-14 lg:w-15 lg:h-15">
					<AvatarImage src={profilePhoto} alt="Your Profile Photo" />
					<AvatarFallback className="text-primary lg:text-xl">
						{formatAvatarName(name)}
					</AvatarFallback>
				</Avatar>
				<div className="w-full flex flex-col justify-center items-center">
					<h1 className="w-full overflow-x-hidden line-clamp-1 text-lg font-medium">
						{name}
					</h1>
					<p className="w-full overflow-x-hidden text-sm line-clamp-1 text-tertiary-foreground">
						{bio}
					</p>
				</div>
			</div>
			<ResponsiveDialog
				trigger={
					<Button size="sm" variant="ghost">
						<IoPencil className="size-5" />
					</Button>
				}
				title="Edit Profile"
			>
				<div>
					<EditProfileForm
						name={name}
						username={username}
						photo={profilePhoto}
						bio={bio}
					/>
				</div>
			</ResponsiveDialog>
		</div>
	);
}
