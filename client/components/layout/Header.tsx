"use client";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/use-auth";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import AuthDropdown from "./AuthDropdown";

export default function Header() {
	const { isAuthenticated, user } = useAuth();
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand>
				<Link href="/" className="font-medium text-inherit">
					{APP_NAME}
				</Link>
			</NavbarBrand>

			<NavbarContent justify="end">
				{isAuthenticated ? (
					<AuthDropdown user={user!} />
				) : (
					<>
						<NavbarItem>
							<Link color="foreground" href="/auth/login">
								<Button color="default">Log In</Button>
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Button color="default" variant="flat" disabled>
								For recruiters
							</Button>
						</NavbarItem>
					</>
				)}
			</NavbarContent>
		</Navbar>
	);
}
