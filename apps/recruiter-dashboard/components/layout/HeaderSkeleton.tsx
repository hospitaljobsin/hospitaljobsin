"use client";
import { Navbar, NavbarBrand, Skeleton } from "@heroui/react";

export default function HeaderSkeleton() {
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand className="flex items-center gap-4">
				<Skeleton className="w-8 h-8 rounded-md" />
				<Skeleton className="w-36 h-6 rounded-sm" />
			</NavbarBrand>
		</Navbar>
	);
}
