import {
	pgTable,
	uuid,
	varchar,
	text,
	boolean,
	timestamp,
	primaryKey,
	index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Users ──────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 20 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: text("password").notNull(),
	isVerified: boolean("is_verified").default(false),
	profilePhoto: text("profile_photo").default(""),
	bio: text("bio").default(""),
	forgotPasswordToken: text("forgot_password_token"),
	forgotPasswordTokenExpiry: timestamp("forgot_password_token_expiry", {
		withTimezone: true,
	}),
	verifyToken: text("verify_token"),
	verifyTokenExpiry: timestamp("verify_token_expiry", {
		withTimezone: true,
	}),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	sentFriendships: many(friends, { relationName: "sentFriendships" }),
	receivedFriendships: many(friends, { relationName: "receivedFriendships" }),
	postLikes: many(postLikes),
	comments: many(comments),
	notifications: many(notifications, { relationName: "userNotifications" }),
	conversationMemberships: many(conversationMembers),
	sentMessages: many(messages),
	wsConnections: many(wsConnections),
}));

// ─── Friends (self-referencing junction) ────────────────────────────────────

export const friends = pgTable(
	"friends",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		friendId: uuid("friend_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.friendId] })],
);

export const friendsRelations = relations(friends, ({ one }) => ({
	user: one(users, {
		fields: [friends.userId],
		references: [users.id],
		relationName: "sentFriendships",
	}),
	friend: one(users, {
		fields: [friends.friendId],
		references: [users.id],
		relationName: "receivedFriendships",
	}),
}));

// ─── Posts ───────────────────────────────────────────────────────────────────

export const posts = pgTable("posts", {
	id: uuid("id").defaultRandom().primaryKey(),
	thread: text("thread").notNull(),
	creatorId: uuid("creator_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	image: text("image").array().default([]),
	tags: text("tags").array().default([]),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	creator: one(users, {
		fields: [posts.creatorId],
		references: [users.id],
	}),
	likes: many(postLikes),
	comments: many(comments),
}));

// ─── Post Likes (junction) ─────────────────────────────────────────────────

export const postLikes = pgTable(
	"post_likes",
	{
		postId: uuid("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.postId, t.userId] })],
);

export const postLikesRelations = relations(postLikes, ({ one }) => ({
	post: one(posts, {
		fields: [postLikes.postId],
		references: [posts.id],
	}),
	user: one(users, {
		fields: [postLikes.userId],
		references: [users.id],
	}),
}));

// ─── Comments ───────────────────────────────────────────────────────────────

export const comments = pgTable("comments", {
	id: uuid("id").defaultRandom().primaryKey(),
	text: text("text").notNull(),
	creatorId: uuid("creator_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	postId: uuid("post_id")
		.notNull()
		.references(() => posts.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
	creator: one(users, {
		fields: [comments.creatorId],
		references: [users.id],
	}),
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id],
	}),
}));

// ─── Notifications ──────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdBy: uuid("created_by").references(() => users.id, {
		onDelete: "set null",
	}),
	message: text("message").notNull(),
	read: boolean("read").default(false),
	destination: text("destination").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id],
		relationName: "userNotifications",
	}),
	creator: one(users, {
		fields: [notifications.createdBy],
		references: [users.id],
	}),
}));

// ─── Conversations ──────────────────────────────────────────────────────────

export const conversations = pgTable("conversations", {
	id: uuid("id").defaultRandom().primaryKey(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const conversationsRelations = relations(conversations, ({ many }) => ({
	members: many(conversationMembers),
	messages: many(messages),
}));

// ─── Conversation Members (junction) ────────────────────────────────────────

export const conversationMembers = pgTable(
	"conversation_members",
	{
		conversationId: uuid("conversation_id")
			.notNull()
			.references(() => conversations.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.conversationId, t.userId] })],
);

export const conversationMembersRelations = relations(
	conversationMembers,
	({ one }) => ({
		conversation: one(conversations, {
			fields: [conversationMembers.conversationId],
			references: [conversations.id],
		}),
		user: one(users, {
			fields: [conversationMembers.userId],
			references: [users.id],
		}),
	}),
);

// ─── Messages ───────────────────────────────────────────────────────────────

export const messages = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),
	conversationId: uuid("conversation_id")
		.notNull()
		.references(() => conversations.id, { onDelete: "cascade" }),
	senderId: uuid("sender_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id],
	}),
	sender: one(users, {
		fields: [messages.senderId],
		references: [users.id],
	}),
}));

// ─── WebSocket Connections ──────────────────────────────────────────────────

export const wsConnections = pgTable(
	"ws_connections",
	{
		connectionId: text("connection_id").primaryKey(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		connectedAt: timestamp("connected_at", { withTimezone: true }).defaultNow(),
	},
	(t) => [index("ws_connections_user_id_idx").on(t.userId)],
);

export const wsConnectionsRelations = relations(wsConnections, ({ one }) => ({
	user: one(users, {
		fields: [wsConnections.userId],
		references: [users.id],
	}),
}));
