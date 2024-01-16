import ProfileCard from "./profile-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import Post from "../post/post";
import ProfileCardSkeleton from "./profile-card-skeleton";
import PostSkeleton from "../post/post-skeleton";
import { PersonProfileType, PostType } from "@/types";

export default function SearchResults(props: { query: string }) {
  const [personResults, setPersonResults] = useState<PersonProfileType[]>([]);
  const [postsResults, setPostsResults] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/search-results?query=${props.query}`, {
          cache: "no-cache",
        });
        const data = await res.json();
        setPersonResults(data.data.users);
        setPostsResults(data.data.posts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [props.query]);

  return (
    <div className="pt-1 px-5 lg:px-0">
      <Tabs defaultValue="person">
        <TabsList>
          <TabsTrigger value="person">Person</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="person">
          <div className="py-4">
            {loading ? (
              <>
                {Array(10)
                  .fill(null)
                  .map((_, i) => (
                    <ProfileCardSkeleton key={i} />
                  ))}
              </>
            ) : (
              <>
                {personResults.length === 0 ? (
                  <div className="text-tertiary-foreground">
                    No results found.
                  </div>
                ) : (
                  <>
                    {personResults.map((person, index) => (
                      <ProfileCard
                        key={person._id}
                        _id={person._id}
                        name={person.name}
                        bio={person.bio}
                        profilePhoto={person.profilePhoto}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="posts">
          <div className="py-4">
            {loading ? (
              <>
                {Array(10)
                  .fill(null)
                  .map((_, i) => (
                    <PostSkeleton key={i} />
                  ))}
              </>
            ) : (
              <>
                {postsResults.length === 0 ? (
                  <div className="text-tertiary-foreground">
                    No results found.
                  </div>
                ) : (
                  <>
                    {postsResults.map((post) => (
                      <Post key={post._id} post={post} paddingX={true} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
