import ProfileCard from "./profile-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Post from "../post/post";
import ProfileCardSkeleton from "./profile-card-skeleton";
import PostSkeleton from "../post/post-skeleton";
import type { PersonProfileType, PostType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function SearchResults(props: { query: string }) {
	const { isPending, error, data, isError } = useQuery({
		queryKey: ["userProfile", props.query],
		queryFn: async () => {
			const res = await fetch(`/api/search-results?query=${props.query}`);
			if (res.ok) {
				const data = await res.json();
				return data.data;
			}
		},
		enabled: !!props.query,
	});
	return (
		<div className="pt-1 px-5 lg:px-0">
			<Tabs defaultValue="posts">
				<TabsList>
					<TabsTrigger value="posts">Posts</TabsTrigger>
					<TabsTrigger value="person">Person</TabsTrigger>
				</TabsList>
				<TabsContent value="posts">
					<div className="py-4">
						{isPending ? (
							<>
								{Array(10)
									.fill(null)
									.map((_, i) => (
										<PostSkeleton key={i} />
									))}
							</>
						) : (
							<>
								{data.posts.length ? (
									<>
										{data.posts.map((post: PostType) => (
											<Post key={post._id} post={post} paddingX={true} />
										))}
									</>
								) : (
									<div className="text-tertiary-foreground">
										No results found.
									</div>
								)}
							</>
						)}
					</div>
				</TabsContent>
				<TabsContent value="person">
					<div className="py-4">
						{isPending ? (
							<>
								{Array(10)
									.fill(null)
									.map((_, i) => (
										<ProfileCardSkeleton key={i} />
									))}
							</>
						) : (
							<>
								{data.users.length ? (
									<>
										{data.users.map((person: PersonProfileType) => (
											<ProfileCard
												key={person._id}
												_id={person._id}
												name={person.name}
												bio={person.bio}
												profilePhoto={person.profilePhoto}
											/>
										))}
									</>
								) : (
									<div className="text-tertiary-foreground">
										No results found.
									</div>
								)}
							</>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
