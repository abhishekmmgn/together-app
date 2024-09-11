"use client";

import Back from "@/components/back";
import ProfileCard from "@/components/explore/profile-card";
import type { PersonProfileType } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import ProfileCardSkeleton from "@/components/explore/profile-card-skeleton";

export default function FriendsPage() {
	const { isLoading, error, data, isError } = useQuery({
		queryKey: ["friends"],
		queryFn: async () => {
			const res = await fetch("/api/user/friends/");
			if (res.ok) {
				const data = await res.json();
				return data.data;
			}
		},
	});

	if (isLoading) {
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
				<div className="w-full h-full flex flex-col justify-center items-center gap-3">
					<h1 className="text-2xl font-medium text-clip">
						You don&apos;t have any friends yet.
					</h1>
					<Link href="/explore" className="w-full flex justify-center">
						<Button className="max-w-md">Search new friends</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
