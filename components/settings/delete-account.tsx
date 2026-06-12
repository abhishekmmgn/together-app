"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
		<>
			<div>
				<h3 className="mb-1 text-lg font-medium">Delete Account</h3>
				<p className="mb-4 text-sm text-muted-foreground">
					Deleting your account will: Delete your profile, along with your
					authentication associations. Delete any and all content you have, such
					as posts, comments, or your messages.
				</p>
				<ResponsiveDialog
					open={open}
					onOpenChange={setOpen}
					trigger={
						<Button variant="destructive" className="mx-auto">
							Delete Account
						</Button>
					}
					title="Are you absolutely sure?"
					description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
				>
					<div className="flex flex-col gap-4 min-[512px]:flex-row min-[512px]:justify-end">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={deleteAccount}
							loading={disabled}
							loadingText="Deleting Account"
						>
							Delete Account
						</Button>
					</div>
				</ResponsiveDialog>
			</div>
		</>
	);
}
