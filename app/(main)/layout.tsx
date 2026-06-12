import { GlobalSidebar } from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "@/components/ui/sidebar";

import { Suspense } from "react";

export default function LayoutOne({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<Toaster />
			<Navbar />
			<GlobalSidebar />
			<div className="flex-1 flex items-center justify-center">
				<div className="w-full h-[calc(100vh-56px)] mt-23 md:mt-14 max-w-2xl">
					{children}
				</div>
			</div>
		</SidebarProvider>
	);
}
