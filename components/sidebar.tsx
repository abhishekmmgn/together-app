"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import { tabs } from "@/components/tabs";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function GlobalSidebar() {
	const routeSegment = useSelectedLayoutSegment();
	const segment = `/${routeSegment || ""}`;

	return (
		<Sidebar className="top-14 h-[calc(100vh-56px)] border-r border-border bg-secondary/30">
			<SidebarContent className="px-3 py-4">
				<SidebarGroup className="p-0">
					<SidebarGroupContent>
						<SidebarMenu className="space-y-1">
							{tabs.map((tab) => {
								const isActive =
									segment === tab.link || segment.startsWith(`${tab.link}/`);
								return (
									<SidebarMenuItem key={tab.link}>
										<SidebarMenuButton
											isActive={isActive}
											className={`h-10 flex justify-start items-center gap-3 px-3 py-1 rounded-lg text-base transition-colors ${
												isActive
													? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
													: "text-tertiary-foreground hover:bg-secondary hover:text-secondary-foreground"
											}`}
											render={
												<Link href={tab.link}>
													{tab.icon}
													<span>{tab.name}</span>
												</Link>
											}
										/>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
