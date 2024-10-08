export default function notFound() {
	return (
		<main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center space-y-4">
				<p className="font-semibold text-primary">404</p>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
					Post not found
				</h1>
				<p className="leading-7">
					Sorry, we couldn’t find the post you’re looking for.
				</p>
			</div>
		</main>
	);
}
