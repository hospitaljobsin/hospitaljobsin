"use client";
import type { AuthNavigationFragment$key } from "@/__generated__/AuthNavigationFragment.graphql";
import links from "@/lib/links";
import {
	Avatar,
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
	BriefcaseBusiness,
	LogOutIcon,
	Settings,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import LogoutModal from "./LogoutModal";

const AuthNavigationFragment = graphql`
  fragment AuthNavigationFragment on Account {
        __typename
        fullName
		avatarUrl
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
					<Avatar
						src={data.avatarUrl}
						name={data.fullName}
						showFallback
						size="sm"
						radius="full"
					/>
				</Button>
			</NavbarItem>

			<NavbarItem className="hidden md:block">
				<Dropdown className="hidden md:block" placement="bottom-end">
					<DropdownTrigger>
						<Button disableRipple isIconOnly radius="sm" variant="light">
							<Avatar
								src={data.avatarUrl}
								name={data.fullName}
								showFallback
								size="sm"
								radius="full"
							/>
						</Button>
					</DropdownTrigger>

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
									<Avatar
										src={data.avatarUrl}
										name={data.fullName}
										showFallback
										size="sm"
										radius="full"
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
							<DropdownItem key="account">
								<Link
									color="foreground"
									href={links.accountSettings}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full gap-4 items-center text-small"
								>
									<Settings className="h-4 w-4" /> Account
								</Link>
							</DropdownItem>
							<DropdownItem
								key="profile"
								startContent={<UserIcon className="h-4 w-4" />}
								href={links.profile}
							>
								Job Seeker Profile
							</DropdownItem>
							<DropdownItem
								key="saved"
								startContent={<BriefcaseBusiness className="h-4 w-4" />}
								href={links.savedJobs}
							>
								My Jobs
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
							<Avatar
								src={data.avatarUrl}
								name={data.fullName}
								showFallback
								size="sm"
								radius="full"
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
							startContent={<Settings className="h-4 w-4" />}
							href={links.accountSettings}
							as={Link}
							target="_blank"
							rel="noopener noreferrer"
							fullWidth
						>
							Account
						</Button>
						<Button
							className="w-full justify-start"
							radius="sm"
							variant="light"
							startContent={<UserIcon className="h-4 w-4" />}
							href={links.profile}
							as={links.profile ? "a" : "button"}
							fullWidth
						>
							Job Seeker Profile
						</Button>
						<Button
							className="w-full justify-start"
							radius="sm"
							variant="light"
							startContent={<BriefcaseBusiness className="h-4 w-4" />}
							href={links.savedJobs}
							as={links.savedJobs ? "a" : "button"}
							fullWidth
						>
							My Jobs
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
			<LogoutModal
				onOpenChange={onLogoutModalOpenChange}
				isOpen={isLogoutModalOpen}
			/>
		</>
	);
}
