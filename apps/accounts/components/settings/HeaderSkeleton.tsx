"use client";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Navbar, NavbarBrand } from "@heroui/react";
import Link from "next/link";
import Logo from "../Logo";

export default function HeaderSkeleton() {
	return (
		<Navbar maxWidth="lg" isBordered className="bg-background-600">
			<NavbarBrand className="flex items-center gap-4 text-foreground-500">
				<Link
					href={links.settings}
					className="font-medium text-inherit flex items-center gap-4"
				>
					<Logo />
					{APP_NAME}
				</Link>
			</NavbarBrand>
		</Navbar>
	);
}
