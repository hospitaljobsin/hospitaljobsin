"use client";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Link, Navbar, NavbarBrand } from "@heroui/react";
import Logo from "../Logo";

export default function HeaderSkeleton() {
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand className="flex items-center gap-4">
				<Link
					href={links.landing}
					className="font-medium text-inherit flex items-center gap-4"
				>
					<Logo />
					{APP_NAME}
				</Link>
			</NavbarBrand>
		</Navbar>
	);
}
