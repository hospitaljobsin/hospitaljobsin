"use client";
import { getGravatarURL } from "@/lib/avatars";
import links from "@/lib/links";
import {
	Button,
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
import type { AuthDropdownFragment$key } from "./__generated__/AuthDropdownFragment.graphql";

const AuthDropdownFragment = graphql`
  fragment AuthDropdownFragment on Account {
        __typename
        fullName
        email
  }
`;

type Props = {
	rootQuery: AuthDropdownFragment$key;
};

export default function AuthDropdown({ rootQuery }: Props) {
	const data = useFragment(AuthDropdownFragment, rootQuery);
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
