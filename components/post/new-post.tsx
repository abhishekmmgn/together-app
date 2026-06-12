"use client";

import { useState, useEffect } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "../ui/button";
import NewPostForm from "./new-post-form";
import { checkLoggedIn } from "@/lib/checkLoggedIn";
import { useRouter } from "next/navigation";

export default function NewPost() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [open, setOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		checkLoggedIn().then((res) => {
			if (res) setIsLoggedIn(true);
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
				trigger={<Button>New post</Button>}
				title="New Post"
			>
				<NewPostForm />
			</ResponsiveDialog>
		</div>
	);
}
