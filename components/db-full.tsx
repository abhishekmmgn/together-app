import { IoArrowUpSharp } from "react-icons/io5";

export default function DbFull() {
	return (
		<>
			<main className="grid h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<p className="text-base font-semibold text-tertiary-foreground">
						Database Full
					</p>
					<h1 className="my-4 text-3xl font-bold tracking-tight text-secondary-foreground sm:text-5xl">
						But you can deploy with your own database.
					</h1>
					<a
						rel="noopener noreferrer"
						href="https://www.github.com/abhishekmmgn/together-app"
						className="text-base leading-7 text-primary mt-6 underline underline-offset-8 flex gap-2 justify-center items-center"
					>
						Go to repository
						<IoArrowUpSharp className="rotate-45" />
					</a>
				</div>
			</main>
		</>
	);
}
