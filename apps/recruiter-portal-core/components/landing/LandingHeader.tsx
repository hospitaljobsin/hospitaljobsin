"use client";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Link as HeroLink,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import Logo from "../Logo";

export default function LandingHeader() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<Navbar
			maxWidth="lg"
			className="w-full"
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
		>
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="md:hidden"
				/>
				<NavbarBrand className="flex items-center gap-4">
					<Link href={links.landing} className="font-medium text-inherit">
						<Logo />
					</Link>
					<Link
						href={links.landing}
						className="font-medium text-inherit hidden sm:block"
					>
						{APP_NAME}
					</Link>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden md:flex gap-6" justify="center">
				<NavbarItem>
					<HeroLink href="#features" color="foreground" className="font-medium">
						Features
					</HeroLink>
				</NavbarItem>
				<NavbarItem>
					<HeroLink href="#" color="foreground" className="font-medium">
						Pricing
					</HeroLink>
				</NavbarItem>
				<NavbarItem>
					<HeroLink href="#" color="foreground" className="font-medium">
						Support
					</HeroLink>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem className="hidden md:flex">
					<Button
						as={Link}
						color="default"
						variant="flat"
						href={links.login(env.NEXT_PUBLIC_URL)}
						className="font-medium"
					>
						Log In
					</Button>
				</NavbarItem>
				<NavbarItem>
					<Button
						as={Link}
						color="primary"
						variant="solid"
						href={links.signup(env.NEXT_PUBLIC_URL + links.createOrganization)}
						className="font-medium"
					>
						Sign Up
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				<NavbarMenuItem>
					<HeroLink
						href="#features"
						color="foreground"
						className="w-full"
						size="lg"
						onClick={() => setIsMenuOpen(false)}
					>
						Features
					</HeroLink>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<HeroLink
						href="#"
						color="foreground"
						className="w-full"
						size="lg"
						onClick={() => setIsMenuOpen(false)}
					>
						Pricing
					</HeroLink>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<HeroLink
						href="#"
						color="foreground"
						className="w-full"
						size="lg"
						onClick={() => setIsMenuOpen(false)}
					>
						Support
					</HeroLink>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<Button
						as={Link}
						color="default"
						variant="flat"
						href={links.login(env.NEXT_PUBLIC_URL)}
						className="font-medium w-full"
						size="lg"
					>
						Log In
					</Button>
				</NavbarMenuItem>
			</NavbarMenu>
		</Navbar>
	);
}
