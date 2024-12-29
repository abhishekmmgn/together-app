"use client";

import Back from "@/components/back";
import ProfileCard from "@/components/explore/profile-card";
import type { PersonProfileType } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import ProfileCardSkeleton from "@/components/explore/profile-card-skeleton";

export default function FriendsPage() {
	const { isPending, error, data, isError } = useQuery({
		queryKey: ["friends"],
		queryFn: async () => {
			const res = await fetch("/api/user/friends/");
			if (res.ok) {
				const data = await res.json();
				return data.data;
			}
		},
	});

	if (isPending) {
		return (
			<div className="p-5 w-full h-full flex flex-col justify-start">
				{Array(10)
					.fill(0)
					.map((_, index) => (
						<ProfileCardSkeleton key={index} />
					))}
			</div>
		);
	}
	if (isError) {
		console.log(error);
		return <p className="text-destructive">Something went wrong</p>;
	}
	return (
		<div className="w-full h-full px-5 lg:px-0">
			<Back />
			{data.length ? (
				<>
					{data.map((user: PersonProfileType) => (
						<ProfileCard
							key={user._id}
							_id={user._id}
							name={user.name}
							profilePhoto={user.profilePhoto}
							bio={user.bio}
						/>
					))}
				</>
			) : (
				<div className="mt-10 w-full grid place-items-center md:mt-40">
					<h1 className="text-3xl font-medium text-clip">
						You don&apos;t have any friends yet.
					</h1>
					<Button variant="link" className="w-fit max-w-fit" asChild>
						<Link href="/explore" className="w-full flex justify-center">
							Search new friends
						</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
