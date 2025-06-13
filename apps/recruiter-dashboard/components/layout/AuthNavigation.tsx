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
	Link,
	useDisclosure,
} from "@heroui/react";
import { LogOutIcon, Settings } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import LogoutModal from "./LogoutModal";

const AuthNavigationFragment = graphql`
  fragment AuthNavigationFragment on Account {
        __typename
        fullName
        avatarUrl
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
			<div className="block md:hidden">
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
			</div>
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
								<p className="truncate max-w-48 text-medium">{data.fullName}</p>
								<span className="truncate max-w-48 text-xs text-foreground-500">
									{data.email}
								</span>
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
							isExternal
							fullWidth
						>
							Account
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
			<div className="hidden md:block">
				<Dropdown className="hidden md:block" placement="bottom-end">
					<DropdownTrigger>
						<Button
							disableRipple
							radius="sm"
							variant="light"
							className="flex items-center gap-3 px-2 py-4"
						>
							<Avatar
								src={data.avatarUrl}
								name={data.fullName}
								showFallback
								size="sm"
								radius="full"
							/>
							<div className="flex flex-col items-start min-w-0">
								<span className="truncate max-w-[160px] text-sm">
									{data.fullName}
								</span>
								<span className="truncate max-w-[160px] text-xs text-foreground-500">
									{data.email}
								</span>
							</div>
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
										<p className="truncate max-w-48 text-medium">
											{data.fullName}
										</p>
										<p className="truncate max-w-48 text-xs text-foreground-500">
											{data.email}
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
									isExternal
									className="w-full gap-4 items-center text-small"
								>
									<Settings className="h-4 w-4" /> Account
								</Link>
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
			</div>
			<LogoutModal
				onOpenChange={onLogoutModalOpenChange}
				isOpen={isLogoutModalOpen}
			/>
		</>
	);
}
