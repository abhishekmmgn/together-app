export type PersonProfileType = {
  _id: string;
  name: string;
  bio: string;
  profilePhoto: string;
};

export type PostType = {
  _id: string;
  thread: string;
  creator: string;
  image: string;
  likes: string[];
  comments: string[];
  tags: string[];
  createdAt: string;
};

export type CommentsType = {
  _id: string;
  text: string;
  user: string;
  postId: string;
};

