"use client";
import { Navbar, NavbarBrand } from "@heroui/react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";

export default function HeaderSkeleton() {
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand>
				<Link href={links.settings} className="font-medium text-inherit">
					{APP_NAME}
				</Link>
			</NavbarBrand>
		</Navbar>
	);
}
