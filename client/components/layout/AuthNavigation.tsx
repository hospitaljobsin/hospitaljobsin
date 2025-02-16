"use client";
import { getGravatarURL } from "@/lib/avatars";
import links from "@/lib/links";
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	NavbarItem,
	useDisclosure,
} from "@heroui/react";
import { BookmarkIcon, ChevronDown, LogOutIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import LogoutModal from "./LogoutModal";
import type { AuthNavigationFragment$key } from "./__generated__/AuthNavigationFragment.graphql";

const AuthNavigationFragment = graphql`
  fragment AuthNavigationFragment on Account {
        __typename
        fullName
        email
  }
`;

type Props = {
	rootQuery: AuthNavigationFragment$key;
};

export default function AuthNavigation({ rootQuery }: Props) {
	const data = useFragment(AuthNavigationFragment, rootQuery);
	const {
		isOpen: isLogoutModalOpen,
		onOpen: onLogoutModalOpen,
		onOpenChange: onLogoutModalOpenChange,
	} = useDisclosure();
	const {
		isOpen: isDrawerOpen,
		onOpen: onDrawerOpen,
		onOpenChange: onDrawerOpenChange,
	} = useDisclosure();

	return (
		<>
			<NavbarItem className="block md:hidden">
				<Button
					disableRipple
					className="p-0 bg-transparent data-[hover=true]:bg-transparent flex items-center gap-4"
					endContent={<ChevronDown className="h-4 w-4" />}
					radius="sm"
					variant="light"
					onPress={onDrawerOpen}
				>
					<Image
						src={`https://${getGravatarURL(data.email)}`}
						alt={data.fullName}
						width={35}
						height={35}
						className="rounded-full"
					/>
					<p className="truncate max-w-48">{data.fullName}</p>
				</Button>
			</NavbarItem>
			<Drawer
				isOpen={isDrawerOpen}
				onClose={onDrawerOpenChange}
				placement="bottom"
				hideCloseButton
			>
				<DrawerContent>
					<DrawerHeader>Navigation Menu</DrawerHeader>
					<DrawerBody className="gap-4 flex flex-col items-center">
						<Button
							className="w-full justify-start"
							radius="sm"
							variant="light"
							startContent={<UserIcon className="h-4 w-4" />}
							href={links.profile}
							as={links.profile ? "a" : "button"}
							fullWidth
						>
							My Profile
						</Button>
						<Button
							className="w-full justify-start"
							radius="sm"
							variant="light"
							startContent={<BookmarkIcon className="h-4 w-4" />}
							href={links.savedJobs}
							as={links.savedJobs ? "a" : "button"}
							fullWidth
						>
							Saved Jobs
						</Button>
						<Button
							className="w-full justify-start"
							radius="sm"
							variant="light"
							startContent={<LogOutIcon className="h-4 w-4" />}
							onPress={onLogoutModalOpen}
							fullWidth
						>
							Log Out
						</Button>
					</DrawerBody>
				</DrawerContent>
			</Drawer>

			<Dropdown className="hidden md:block">
				<NavbarItem className="hidden md:block">
					<DropdownTrigger>
						<Button
							disableRipple
							className="p-0 bg-transparent data-[hover=true]:bg-transparent items-center gap-4 hidden md:flex"
							endContent={<ChevronDown className="h-4 w-4" />}
							radius="sm"
							variant="light"
						>
							<Image
								src={`https://${getGravatarURL(data.email)}`}
								alt={data.fullName}
								width={35}
								height={35}
								className="rounded-full"
							/>
							<p className="truncate max-w-48">{data.fullName}</p>
						</Button>
					</DropdownTrigger>
				</NavbarItem>

				<DropdownMenu
					variant="light"
					aria-label="ACME features"
					itemClasses={{
						base: "gap-4",
					}}
					className="hidden md:block"
				>
					<DropdownItem
						key="profile"
						startContent={<UserIcon className="h-4 w-4" />}
						href={links.profile}
					>
						My Profile
					</DropdownItem>
					<DropdownItem
						key="saved"
						startContent={<BookmarkIcon className="h-4 w-4" />}
						href={links.savedJobs}
					>
						Saved Jobs
					</DropdownItem>
					<DropdownItem
						key="logout"
						startContent={<LogOutIcon className="h-4 w-4" />}
						onPress={onLogoutModalOpen}
					>
						Log Out
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<LogoutModal
				onOpenChange={onLogoutModalOpenChange}
				isOpen={isLogoutModalOpen}
			/>
		</>
	);
}
