import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Profile'
}
 
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section className="w-full h-full">{children}</section>
}