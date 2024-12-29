export default function ErrorInfo() {
	return (
		<main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center space-y-4">
				<p className="text-destructive">Error</p>
				<h1 className="text-3xl font-medium tracking-tight sm:text-5xl">
					Something went wrong.
				</h1>
				<p className="leading-7">Please try refreshing the page.</p>
			</div>
		</main>
	);
}
export function ShortErrorInfo({ title }: { title?: string }) {
	return (
		<main className="p-5 grid place-items-center">
			<p className="text-center text-destructive">
				{title ?? "Something went wrong"}
			</p>
		</main>
	);
}
