"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LogoutComponent() {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	async function handleLogout() {
		try {
			const res = await fetch("/api/auth/logout");
			if (res.ok) {
				toast.success("Logout successfully");
				router.push("/auth/login");
			}
		} catch (err: any) {
			console.log("Error: ", err.message);
			toast.error(err.message);
		}
	}
	return (
		<>
			<h3 className="mb-1 text-lg font-medium">Sign Out</h3>
			<ResponsiveDialog
				open={open}
				onOpenChange={setOpen}
				trigger={
					<Button variant="secondary" className="mx-auto">
						Sign Out
					</Button>
				}
				title="Sign out of current device?"
			>
				<div className="flex flex-col gap-4 min-[512px]:flex-row min-[512px]:justify-end">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleLogout}>
						Confirm
					</Button>
				</div>
			</ResponsiveDialog>
		</>
	);
}
