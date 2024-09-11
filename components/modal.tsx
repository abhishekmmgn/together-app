"use client";

export default function Modal(props: any) {
	return (
		<div className="z-[100] absolute inset-y-0 inset-x-0 h-screen  sm:top-14 md:max-w-2xl sm:inset-x-auto">
			<div className="w-full h-12 sticky z-50 top-0 inset-x-0 py-1 font-medium text-lg  backdrop-filter backdrop-blur-xl bg-opacity-80">
				<div className="container h-full px-5 md:px-10">
					<div className="-ml-2 w-fit h-full hover:cursor-pointer flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
				</div>
			</div>
			{props.children}
		</div>
	);
}
