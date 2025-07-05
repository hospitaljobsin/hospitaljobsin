"use client";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Link, Navbar, NavbarBrand } from "@heroui/react";
import Logo from "../Logo";

export default function HeaderSkeleton({
	variant,
}: {
	variant: "default" | "hero";
}) {
	return (
		<Navbar
			maxWidth="xl"
			isBordered={variant !== "hero"}
			classNames={{
				base:
					variant === "default" ? "" : "bg-transparent text-primary-foreground",
			}}
		>
			<NavbarBrand className="flex items-center gap-4">
				<Link
					href={links.landing}
					className="font-medium text-inherit flex items-center gap-4"
				>
					<Logo />
				</Link>
				<Link
					href={links.landing}
					className="font-medium text-inherit sm:flex items-center gap-4 hidden"
				>
					{APP_NAME}
				</Link>
			</NavbarBrand>
		</Navbar>
	);
}
