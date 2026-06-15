import Header from "@/components/header";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section>
			<Header />
			<div className="w-full px-5 mt-14 h-[calc(100vh-56px)] flex flex-col items-center justify-center horizontal-padding vertical-padding">
				{children}
			</div>
		</section>
	);
}
