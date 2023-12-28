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
  image: string[];
  likes: string[];
  liked: boolean;
  comments: [];
  tags: string[];
  createdAt: string;
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

export type ActiveConversationType = {
  conversationId: string;
  otherUserId?: string;
};

export type ConversationType = {
  conversationId: string;
  lastMessage: {
    time: string;
    message: string;
  };
  user: {
    _id: string;
    name: string;
    profilePhoto: string;
  };
};

export interface MessageObject {
  [key: string]: string;
}
