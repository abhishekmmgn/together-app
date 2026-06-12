"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { IoChevronForwardOutline } from "react-icons/io5";

export default function DeleteAccountComponent() {
	const router = useRouter();
	const [disabled, setDisabled] = useState<boolean>(false);
	const [open, setOpen] = useState(false);

	async function deleteAccount() {
		setDisabled(true);
		try {
			const res = await fetch("/api/user", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.ok) {
				toast.success("Account deleted successfully");
				router.push("/auth/register");
			} else if (res.status === 400) {
				console.log("Invalid _id");
				toast.error("Please reauthenticate and try again.");
			} else if (res.status === 500) {
				toast.error("Server error");
				console.log("Server error");
			}
		} catch (err: any) {
			toast.error(err.message);
			console.log("Error: ", err.message);
		} finally {
			setDisabled(false);
		}
	}
	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={setOpen}
			trigger={
				<button className="w-full flex items-center justify-between text-left outline-none cursor-pointer p-4 hover:bg-destructive/5 dark:hover:bg-destructive/10 transition-colors text-destructive">
					<div className="space-y-0.5">
						<div className="text-base font-medium">Delete Account</div>
						<div className="text-sm text-muted-foreground/80">
							Permanently delete your profile, posts, comments, and messages
						</div>
					</div>
					<IoChevronForwardOutline className="h-5 w-5 text-destructive" />
				</button>
			}
			title="Are you absolutely sure?"
			description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
		>
			<Button
				variant="destructive"
				className="w-full mt-12"
				onClick={deleteAccount}
				loading={disabled}
				loadingText="Deleting Account"
			>
				Delete Account
			</Button>
		</ResponsiveDialog>
	);
}
