import { useEffect, useState } from "react";
import ProfileCard from "./profile-card";
import { PersonProfileType } from "@/types";
import ProfileCardSkeleton from "./profile-card-skeleton";

export default function SearchDefault() {
  const [suggestions, setSuggestions] = useState<PersonProfileType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/explore/suggestions", {
          cache: "no-cache",
        });
        const data = await res.json();
        console.log(data);
        setSuggestions(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    const loadingArray = [1, 2, 3, 4, 5, 6, 7];
    return (
      <div className="pt-1 px-5 lg:px-0">
        {loadingArray.map((index) => (
          <ProfileCardSkeleton key={index} />
        ))}
      </div>
    );
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
