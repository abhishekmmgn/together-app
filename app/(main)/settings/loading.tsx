import { Card, CardContent } from "@/components/ui/card";
import {
	Skeleton,
	SkeletonButton,
	SkeletonSwitch,
} from "@/components/ui/skeleton";

export default function SettingsLoading() {
	return (
		<div className="p-4 px-5 space-y-6 lg:px-0 pb-10">
			<div className="pb-2 border-b border-border/60">
				<Skeleton className="h-8 w-24 rounded-md" />
			</div>

			<div className="space-y-6">
				<SettingsSectionSkeleton labelWidth="w-16">
					<SettingsRowSkeleton labelWidth="w-28" descWidth="w-44" />
					<SettingsRowSkeleton
						labelWidth="w-32"
						descWidth="w-44"
						right={<ChevronSkeleton />}
					/>
					<SettingsRowSkeleton
						labelWidth="w-20"
						descWidth="w-40"
						right={<ChevronSkeleton />}
					/>
					<SettingsRowSkeleton
						labelWidth="w-28"
						descWidth="w-64"
						right={<ChevronSkeleton />}
					/>
				</SettingsSectionSkeleton>

				<SettingsSectionSkeleton labelWidth="w-24">
					<SettingsRowSkeleton
						labelWidth="w-40"
						descWidth="w-60"
						right={<SkeletonSwitch />}
					/>
					<SettingsRowSkeleton
						labelWidth="w-28"
						descWidth="w-52"
						right={<SkeletonSwitch />}
					/>
				</SettingsSectionSkeleton>

				<SettingsSectionSkeleton labelWidth="w-24">
					<SettingsRowSkeleton
						labelWidth="w-14"
						descWidth="w-52"
						right={<SkeletonButton size="icon" />}
					/>
				</SettingsSectionSkeleton>
			</div>
		</div>
	);
}

function SettingsSectionSkeleton({
	labelWidth,
	children,
}: {
	labelWidth: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-2">
			<Skeleton className={`h-3.5 rounded-sm ${labelWidth}`} />
			<Card className="overflow-hidden border border-border bg-card shadow-sm rounded-xl py-0">
				<CardContent className="p-0 divide-y divide-border/60">
					{children}
				</CardContent>
			</Card>
		</div>
	);
}

function SettingsRowSkeleton({
	labelWidth,
	descWidth,
	right,
}: {
	labelWidth: string;
	descWidth: string;
	right?: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between p-4">
			<div className="space-y-0.5">
				<Skeleton className={`h-4 ${labelWidth}`} />
				<Skeleton className={`h-3.5 ${descWidth}`} />
			</div>
			{right}
		</div>
	);
}

function ChevronSkeleton() {
	return <Skeleton className="h-5 w-5 rounded-full" />;
}
