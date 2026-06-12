"use client";

import { useState, useEffect } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "../ui/button";
import { IoAddOutline } from "react-icons/io5";
import NewPostForm from "./new-post-form";
import { checkLoggedIn } from "@/lib/checkLoggedIn";
import { useRouter } from "next/navigation";

export default function NewPost() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [open, setOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		checkLoggedIn().then((res) => {
			if (res) {
				setIsLoggedIn(true);
			}
		});
	}, []);

	return (
		<div className="fixed z-50 bottom-6 right-6 lg:bottom-10 lg:right-10">
			<ResponsiveDialog
				open={open}
				onOpenChange={(val) => {
					if (!isLoggedIn) {
						router.push("/auth/login");
					} else {
						setOpen(val);
					}
				}}
				trigger={
					<Button
						size="sm"
						className="h-10"
					>
						<IoAddOutline className="w-5 h-5 mr-1" />
						<span className="text-sm">New Post</span>
					</Button>
				}
				title="New Post"
			>
				<NewPostForm />
			</ResponsiveDialog>
		</div>
	);
}
