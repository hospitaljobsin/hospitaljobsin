"use client";
import { getGravatarURL } from "@/lib/avatars";
import links from "@/lib/links";
import {
	Button,
	Divider,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	NavbarItem,
	useDisclosure,
} from "@heroui/react";
import {
	BookmarkIcon,
	Building,
	ChevronDown,
	LogOutIcon,
	PlusIcon,
	UserIcon,
} from "lucide-react";
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
					isIconOnly
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
						<div className="flex flex-row items-center gap-4 w-full">
							<Image
								src={`https://${getGravatarURL(data.email)}`}
								alt={data.fullName}
								width={25}
								height={25}
								className="rounded-full"
							/>
							<div className="flex flex-col gap-1 items-start">
								<p className="text-tiny">Signed in as</p>
								<p className="truncate max-w-48 text-medium">{data.fullName}</p>
							</div>
						</div>
						<Divider />
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
						<Divider />
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
							size="sm"
							variant="bordered"
							endContent={<ChevronDown className="h-3 w-3" />}
						>
							<PlusIcon className="h-4 w-4" />
						</Button>
					</DropdownTrigger>
				</NavbarItem>

				<DropdownMenu
					variant="light"
					aria-label="Navigation Menu"
					itemClasses={{
						base: "gap-4",
					}}
					className="hidden md:block"
				>
					<DropdownSection>
						<DropdownItem
							key="profile"
							startContent={<Building className="h-4 w-4" />}
							href={links.profile}
						>
							New Organization
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
			<Dropdown className="hidden md:block">
				<NavbarItem className="hidden md:block">
					<DropdownTrigger>
						<Button disableRipple isIconOnly radius="sm" variant="light">
							<Image
								src={`https://${getGravatarURL(data.email)}`}
								alt={data.fullName}
								width={35}
								height={35}
								className="rounded-full"
							/>
						</Button>
					</DropdownTrigger>
				</NavbarItem>

				<DropdownMenu
					variant="light"
					aria-label="Navigation Menu"
					itemClasses={{
						base: "gap-4",
					}}
					className="hidden md:block"
				>
					<DropdownSection showDivider>
						<DropdownItem key="account-info">
							<div className="flex flex-row items-center gap-4 w-full">
								<Image
									src={`https://${getGravatarURL(data.email)}`}
									alt={data.fullName}
									width={25}
									height={25}
									className="rounded-full"
								/>
								<div className="flex flex-col gap-1 items-start">
									<p className="text-tiny">Signed in as</p>
									<p className="truncate max-w-48 text-medium">
										{data.fullName}
									</p>
								</div>
							</div>
						</DropdownItem>
					</DropdownSection>
					<DropdownSection showDivider>
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
					</DropdownSection>
					<DropdownSection>
						<DropdownItem
							key="logout"
							startContent={<LogOutIcon className="h-4 w-4" />}
							onPress={onLogoutModalOpen}
						>
							Log Out
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
			<LogoutModal
				onOpenChange={onLogoutModalOpenChange}
				isOpen={isLogoutModalOpen}
			/>
		</>
	);
}
