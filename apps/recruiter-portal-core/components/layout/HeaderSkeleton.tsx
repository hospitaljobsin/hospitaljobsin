"use client";
import { APP_NAME } from "@/lib/constants";
import { Navbar, NavbarBrand } from "@heroui/react";
import Logo from "../Logo";

export default function HeaderSkeleton() {
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand className="flex items-center gap-4">
				<Logo />
				<h2 className="font-medium text-inherit">{APP_NAME}</h2>
			</NavbarBrand>
		</Navbar>
	);
}
