import ProfileCard from "./profile-card";

export default function SearchDefault() {
  return (
    <div className="pt-1 px-5 lg:px-0">
      <h2 className="pb-2 text-2xl font-medium">People you may know</h2>
      <ProfileCard />
      <ProfileCard />
    </div>
  );
}
