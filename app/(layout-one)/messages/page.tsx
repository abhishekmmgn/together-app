import Messages from "@/components/messages/messages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

export default function ConversationsPage() {
  return <Messages />;
}
