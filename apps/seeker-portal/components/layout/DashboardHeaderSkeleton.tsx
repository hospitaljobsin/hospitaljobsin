"use client";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import {
	Input,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import { SearchIcon } from "lucide-react";
import Logo from "../Logo";

export default function DashboardHeaderSkeleton() {
	return (
		<Navbar
			maxWidth="xl"
			isBordered
			classNames={{
				base: "bg-background-600",
			}}
		>
			{/* Centered search input */}
			<NavbarContent justify="center" className="flex-1 w-full flex gap-12">
				<NavbarBrand className={"flex items-center gap-4 text-foreground-500"}>
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
				<NavbarItem className="w-full">
					<Input
						isDisabled
						placeholder="Search by Speciality or keyword"
						startContent={
							<SearchIcon size={16} className="text-foreground-500" />
						}
						fullWidth
						variant="bordered"
						className="hidden lg:block"
						classNames={{
							inputWrapper: "bg-background",
						}}
						autoComplete="off"
					/>
				</NavbarItem>
				<NavbarItem>
					<span />
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
