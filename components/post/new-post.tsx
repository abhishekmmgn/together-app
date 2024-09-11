"use client";

import { Button } from "../ui/button";
import { IoAdd } from "react-icons/io5";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import NewPostForm from "./new-post-form";
import { checkLoggedIn } from "@/lib/checkLoggedIn";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPost() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
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
			<Dialog>
				<DialogTrigger asChild>
					<Button
						size="sm"
						className="h-10"
						onClick={() => {
							if (!isLoggedIn) {
								router.push("/auth/login");
							}
						}}
					>
						<IoAdd className="w-5 h-5 mr-1" />
						<span className="text-sm">New Post</span>
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>New Post</DialogTitle>
					</DialogHeader>
					<NewPostForm />
				</DialogContent>
			</Dialog>
		</div>
	);
}
