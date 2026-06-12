export type PersonProfileType = {
  _id: string;
  name: string;
  bio: string;
  profilePhoto: string;
};

export interface BasicPostInterface {
  _id: string;
  thread: string;
  image: string;
  likes: number;
  liked: boolean;
  commentsLength: number;
  comments?: [];
  createdAt: string;
}
export interface PostType extends BasicPostInterface {
  creator: {
    _id: string;
    name: string;
    profilePhoto: string;
  };
}

export type CommentsType = {
  _id: string;
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
