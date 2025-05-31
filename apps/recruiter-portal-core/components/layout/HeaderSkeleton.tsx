"use client";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Navbar, NavbarBrand } from "@heroui/react";
import Link from "next/link";
import Logo from "../Logo";

export default function HeaderSkeleton() {
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand className="flex items-center gap-4">
				<Link
					href={links.createOrganization}
					className="font-medium text-inherit"
				>
					<Logo />
				</Link>
				<Link
					href={links.createOrganization}
					className="font-medium text-inherit"
				>
					{APP_NAME}
				</Link>
			</NavbarBrand>
		</Navbar>
	);
}
