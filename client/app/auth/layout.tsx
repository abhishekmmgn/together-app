import Header from "@/components/header";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Toaster />
      <Header />
      <div className="container w-full px-5 mt-14 pb-5 h-screen flex flex-col items-center justify-start sm:py-5 sm:justify-center">
        <div className="mx-auto flex w-full flex-col justify-center max-w-md">
          {children}
        </div>
      </div>
    </section>
  );
}
