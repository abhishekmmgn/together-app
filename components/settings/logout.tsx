"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LogoutComponent() {
	const router = useRouter();

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
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="secondary" className="mx-auto">
						Sign Out
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Sign out of current device?</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleLogout}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
