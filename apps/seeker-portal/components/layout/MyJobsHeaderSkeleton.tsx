"use client";
import links from "@/lib/links";
import { Link, Navbar, NavbarBrand } from "@heroui/react";
import Logo from "../Logo";
import MyJobsTabs from "../my-jobs/MyJobsTabs";

export default function MyJobsHeaderSkeleton() {
	return (
		<div className="w-full flex flex-col bg-background border-b border-foreground-300 sticky top-0 z-50">
			<Navbar maxWidth="xl">
				<NavbarBrand className="flex items-center gap-4 text-foreground-500">
					<Link href={links.landing} className="font-medium text-inherit">
						<Logo />
					</Link>
					<Link
						href={links.landing}
						className="font-medium text-inherit sm:flex items-center gap-4 hidden"
					>
						My Jobs
					</Link>
				</NavbarBrand>
			</Navbar>
			<div className="w-full max-w-7xl mx-auto flex items-center justify-between">
				<MyJobsTabs />
			</div>
		</div>
	);
}
