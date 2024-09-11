"use client";

import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

export default function Back() {
	const router = useRouter();

	return (
		<div className="h-11 lg:px-0 flex items-center">
			<div
				className="hover:cursor-pointer flex items-center"
				onClick={() => router.back()}
			>
				<IoChevronBack className="h-5 w-5 pl-2" />
				<p className="text-sm+">Back</p>
			</div>
		</div>
	);
}
