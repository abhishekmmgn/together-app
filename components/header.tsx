import Link from "next/link";

export default function Header() {
	return (
		<div className="fixed w-full h-14 z-50 top-0 inset-x-0 py-1 font-medium text-lg bg-background backdrop-filter backdrop-blur-xl bg-opacity-80">
			<div className="container h-full flex items-center px-5 text-primary md:px-10 gap-1">
				<Link href="/">Together</Link>
			</div>
		</div>
	);
}
