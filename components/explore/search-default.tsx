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
    <div className="pt-1 px-5 lg:px-0">
      <h2 className="pb-2 text-2xl font-medium text-secondary-foreground">
        People you may know
      </h2>
      {suggestions.length === 0 ? (
        <div className="text-tertiary-foreground">No suggestions.</div>
      ) : (
        <>
          {suggestions.map((person: PersonProfileType, index) => (
            <ProfileCard
              key={person._id}
              _id={person._id}
              name={person.name}
              profilePhoto={person.profilePhoto}
              bio={person.bio}
            />
          ))}
        </>
      )}
    </div>
  );
}
