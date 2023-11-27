import ProfileCardSkeleton from "./profile-card-skeleton";

export default function SearchSuggestions() {
  return (
    <div className="w-full h-screen transition-all ease-in-out duration-300 px-5 lg:px-0">
      <ProfileCardSkeleton />
      <ProfileCardSkeleton />
      <ProfileCardSkeleton />
      <ProfileCardSkeleton />
      <ProfileCardSkeleton />
    </div>
  );
}
