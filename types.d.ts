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
  createdAt: Date;
};

export type CommentsType = {
  _id: string;
  text: string;
  user: string;
  postId: string;
};

export type NotificationType = {
  _id: string;
  message: string;
  read: boolean;
  time: Date;
};
