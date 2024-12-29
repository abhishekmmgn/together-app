"use client";

import type { PostType } from "@/types";
import { useState, useRef, useEffect } from "react";

const useInfiniteScroll = (fetchData: (page: number) => Promise<any[]>) => {
	const [data, setData] = useState<PostType[]>([]);
	const [isPending, setisPending] = useState(false);
	const [page, setPage] = useState(2);
	const [hasMore, setHasMore] = useState(true);
	const loader = useRef(null);

	const handleObserver = (entities: any) => {
		const target = entities[0];
		if (target.isIntersecting) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	useEffect(() => {
		const observer = new IntersectionObserver(handleObserver, { threshold: 1 });
		if (loader.current) {
			observer.observe(loader.current);
		}
	}, []);

	useEffect(() => {
		if (hasMore) {
			setisPending(true);
			fetchData(page).then((newData) => {
				setData((prevData) => [...prevData, ...newData]);
				setisPending(false);
				if (newData.length === 0) {
					setHasMore(false);
				}
			});
		}
	}, [page]);

	return { data, isPending, loader };
};

export default useInfiniteScroll;
