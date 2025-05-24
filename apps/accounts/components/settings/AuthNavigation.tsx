"use client";
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
import { LogOutIcon } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { AuthNavigationFragment$key } from "@/__generated__/AuthNavigationFragment.graphql";
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
								radius="full"
								size="sm"
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
							startContent={<LogOutIcon className="h-4 w-4" />}
							onPress={onLogoutModalOpen}
							fullWidth
						>
							Log Out
						</Button>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			<NavbarItem className="hidden md:block">
				<Dropdown className="hidden md:block" placement="bottom-end">
					<DropdownTrigger>
						<Button disableRipple isIconOnly radius="sm" variant="light">
							<Avatar
								src={data.avatarUrl}
								name={data.fullName}
								showFallback
								radius="full"
								size="sm"
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
										radius="full"
										size="sm"
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
			<LogoutModal
				onOpenChange={onLogoutModalOpenChange}
				isOpen={isLogoutModalOpen}
			/>
		</>
	);
}
