import Header from "@/components/header"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <Header />
      {children}
    </main>
  )
}
