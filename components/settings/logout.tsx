"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { IoChevronForwardOutline } from "react-icons/io5";

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
		<ResponsiveDialog
			open={open}
			onOpenChange={setOpen}
			trigger={
				<button className="w-full flex items-center justify-between text-left outline-none cursor-pointer p-4 hover:bg-muted/50 transition-colors">
					<div className="space-y-0.5">
						<div className="text-base font-medium">Sign Out</div>
						<div className="text-sm text-muted-foreground">
							Sign out of your current device
						</div>
					</div>
					<IoChevronForwardOutline className="h-5 w-5 text-muted-foreground/80" />
				</button>
			}
			title="Sign out of current device?"
		>
			<Button className="w-full mt-12" onClick={handleLogout}>
				Confirm
			</Button>
		</ResponsiveDialog>
	);
}
