import { GlobalSidebar } from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function LayoutOne({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<Navbar />
			<GlobalSidebar />
			<div className="main-content w-full h-[calc(100vh-56px)] mt-23 md:mt-14 max-w-2xl">
				{children}
			</div>
		</SidebarProvider>
	);
}
