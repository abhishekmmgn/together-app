export default function ErrorInfo() {
	return (
		<main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center space-y-4">
				<p className="text-base font-semibold text-destructive">Error</p>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
					Something went wrong.
				</h1>
				<p className="text-base leading-7">Please try refreshing the page.</p>
			</div>
		</main>
	);
}
