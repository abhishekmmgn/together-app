import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Messages'
}
 
export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section className="w-full h-full">{children}</section>
}