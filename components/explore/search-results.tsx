import ProfileCard from "./profile-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import Post from "../post/post";
import ProfileCardSkeleton from "./profile-card-skeleton";
import PostSkeleton from "../post/post-skeleton";
import { PersonProfileType, PostType } from "@/types";

const loadingArray = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SearchResults(props: { query: string }) {
  const [personResults, setPersonResults] = useState<PersonProfileType[]>([]);
  const [postsResults, setPostsResults] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Runs");
      try {
        const res = await fetch(`/api/search-results?query=${props.query}`, {
          cache: "no-cache",
        });
        const data = await res.json();
        console.log(data);
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

  console.log(postsResults);

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
                {loadingArray.map((index) => (
                  <ProfileCardSkeleton key={index} />
                ))}
              </>
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
          </div>
        </TabsContent>
        <TabsContent value="posts">
          <div className="py-4">
            {loading ? (
              <>
                {loadingArray.map((index) => (
                  <PostSkeleton key={index} />
                ))}
              </>
            ) : (
              <>
                {postsResults.map((post) => (
                  <Post key={post._id} post={post} paddingX={true} />
                ))}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
