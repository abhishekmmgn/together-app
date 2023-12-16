export type PersonProfileType = {
  _id: string;
  name: string;
  bio: string;
  profilePhoto: string;
};

export type PostType = {
  _id: string;
  thread: string;
  creator: {
    _id: string;
    name: string;
    profilePhoto: string;
  };
  image: string;
  likes: string[];
  liked: boolean;
  comments: string[];
  tags: string[];
  createdAt: Date;
};

export type CommentsType = {
  createdBy: {
    _id: string;
    name: string;
    profilePhoto: string;
  };
  message: string;
  createdAt: Date;
};

export type NotificationType = {
  _id: string;
  message: string;
  read: boolean;
  createdAt: Date;
  destination: string;
};
