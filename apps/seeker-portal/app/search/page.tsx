"use client";

import SearchViewSkeleton from "@/components/search/SearchViewSkeleton";
import dynamic from "next/dynamic";

const SearchClientComponent = dynamic(() => import("./SearchClientComponent"), {
	ssr: false,
	loading: () => <SearchViewSkeleton />,
});

export default function SearchPage() {
	return <SearchClientComponent />;
}
