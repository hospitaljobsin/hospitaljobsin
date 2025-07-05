"use client";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Navbar, NavbarBrand, NavbarContent, cn } from "@heroui/react";
import Link from "next/link";
import Logo from "../Logo";

export default function LandingHeaderSkeleton() {
	return (
		<div className={cn("w-full flex flex-col static top-0 z-50")}>
			<Navbar
				maxWidth="xl"
				isBordered={false}
				position="static"
				classNames={{
					base: "bg-transparent text-primary-foreground",
				}}
				isBlurred={false}
			>
				<NavbarBrand className={cn("flex items-center gap-4")}>
					<Link
						href={links.landing}
						className="font-medium text-inherit flex items-center gap-4"
					>
						<Logo />{" "}
						<span className="font-medium text-inherit sm:flex items-center gap-4 hidden">
							{APP_NAME}
						</span>
					</Link>
				</NavbarBrand>

				<NavbarContent justify="end">test</NavbarContent>
			</Navbar>
		</div>
	);
}
