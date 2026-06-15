import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoSearch, IoCloseCircle } from "react-icons/io5";
import { cn } from "@/lib/utils";

type PropsType = {
	searchActive: boolean;
	setSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
	placeholder: string;
	className?: string;
};

export default function SearchBar(props: PropsType) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryParam = searchParams.get("query") || "";

	const [searchTerm, setSearchTerm] = useState(queryParam);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setSearchTerm(queryParam);
	}, [queryParam]);

	function pushQuery(term: string) {
		const params = new URLSearchParams(searchParams.toString());
		if (term) {
			params.set("query", term.toLowerCase());
		} else {
			params.delete("query");
		}
		const newQuery = params.toString();
		router.replace(newQuery ? `${pathname}?${newQuery}` : pathname);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const term = e.target.value;
		setSearchTerm(term);

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			pushQuery(term.trim());
		}, 300);
	}

	function handleKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			if (debounceRef.current) clearTimeout(debounceRef.current);
			props.setSearchActive(false);
			pushQuery(searchTerm.trim());
		}
	}

	const handleClear = () => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		setSearchTerm("");
		const params = new URLSearchParams(searchParams.toString());
		params.delete("query");
		const newQuery = params.toString();
		router.replace(newQuery ? `${pathname}?${newQuery}` : pathname);
	};

	return (
		<div
			className={cn(
				"sticky inset-x-0 z-40 px-5 py-4 bg-background backdrop-filter backdrop-blur-xl bg-opacity-80 flex gap-4 items-center justify-between sm:top-14 lg:px-0 group",
				props.className,
			)}
		>
			<div className="relative w-full group">
				<IoSearch className="text-muted-foreground size-4 absolute left-3 top-1/2 -translate-y-1/2 " />
				<Input
					type="text"
					value={searchTerm}
					placeholder={props.placeholder}
					onFocus={() => props.setSearchActive(true)}
					onChange={handleChange}
					onKeyDown={handleKeydown}
					className="bg-secondary pl-8 pr-8 md:pl-9 md:pr-9"
				/>
				{searchTerm && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none flex items-center justify-center"
					>
						<IoCloseCircle className="size-4" />
					</button>
				)}
			</div>
			{props.searchActive && (
				<Button
					variant="secondary"
					size="sm"
					className="transform px-0 text-primary bg-background hover:bg-background"
					onClick={() => {
						props.setSearchActive(false);
						handleClear();
					}}
				>
					Cancel
				</Button>
			)}
		</div>
	);
}
