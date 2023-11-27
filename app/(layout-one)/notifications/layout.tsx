import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Notifications'
}
 
export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section className="w-full h-full">{children}</section>
}