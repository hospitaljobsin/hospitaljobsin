"use client";
import { getGravatarURL } from "@/lib/avatars";
import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	NavbarItem,
	useDisclosure,
} from "@nextui-org/react";
import { BookmarkIcon, ChevronDown, LogOutIcon, UserIcon } from "lucide-react";
import LogoutModal from "./LogoutModal";

type Props = {
	user: { fullName: string; email: string };
};

export default function AuthDropdown({ user }: Props) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<Dropdown>
				<NavbarItem>
					<DropdownTrigger>
						<Button
							disableRipple
							className="p-0 bg-transparent data-[hover=true]:bg-transparent flex items-center gap-4"
							endContent={<ChevronDown className="h-4 w-4" />}
							radius="sm"
							variant="light"
						>
							<Avatar
								name={user.fullName}
								size="sm"
								src={getGravatarURL(user.email)}
							/>
							{user.fullName}
						</Button>
					</DropdownTrigger>
				</NavbarItem>
				<DropdownMenu
					variant="light"
					aria-label="ACME features"
					itemClasses={{
						base: "gap-4",
					}}
				>
					<DropdownItem
						key="profile"
						startContent={<UserIcon className="h-4 w-4" />}
						href="/profile"
					>
						My Profile
					</DropdownItem>
					<DropdownItem
						key="saved"
						startContent={<BookmarkIcon className="h-4 w-4" />}
						href="/saved"
					>
						Saved Jobs
					</DropdownItem>
					<DropdownItem
						key="logout"
						startContent={<LogOutIcon className="h-4 w-4" />}
						onPress={onOpen}
					>
						Log Out
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<LogoutModal onOpenChange={onOpenChange} isOpen={isOpen} />
		</>
	);
}
