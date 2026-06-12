import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface SettingsSectionProps {
	title: string;
	children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
	return (
		<div className="space-y-2">
			<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 px-1">
				{title}
			</h2>
			<Card className="overflow-hidden border border-border bg-card shadow-sm rounded-xl py-0">
				<CardContent className="p-0 divide-y divide-border/60">
					{children}
				</CardContent>
			</Card>
		</div>
	);
}
