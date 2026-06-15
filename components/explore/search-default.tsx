"use client";

import { useSearchParams } from "next/navigation";
import ProfileCard from "./profile-card";
import type { PersonProfileType } from "@/types";

export default function SearchDefault({
	suggestions,
}: {
	suggestions: PersonProfileType[];
}) {
	const params = useSearchParams();
	const query = params.get("query");

	if (query) {
		return <></>;
	}
	return (
		<div className="w-full h-full px-5 lg:px-0 flex flex-col overflow-hidden">
			<h2 className="pb-2 text-2xl font-semibold text-secondary-foreground shrink-0">
				People you may know
			</h2>
			{suggestions.length === 0 ? (
				<div className="text-muted-foreground">No suggestions.</div>
			) : (
				<div className="flex-1 overflow-y-auto pr-1">
					{suggestions.map((person: PersonProfileType, index) => (
						<ProfileCard
							key={person._id}
							_id={person._id}
							name={person.name}
							username={person.username}
							profilePhoto={person.profilePhoto}
							bio={person.bio}
						/>
					))}
				</div>
			)}
		</div>
	);
}
