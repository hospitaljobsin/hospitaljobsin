"use client";
import { handleSignOut } from "@/lib/cognitoActions";
import { APP_NAME } from "@/lib/constants";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import {
  FetchUserAttributesOutput,
  fetchUserAttributes,
} from "aws-amplify/auth";
import { ChevronDown, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<FetchUserAttributesOutput | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await fetchUserAttributes();
        setUser(user);
      } catch {
        setUser(null);
      }
    }
    if (!user) fetchUser();
  }, [user]);

  async function handleLogout() {
    await handleSignOut(router);
  }

  return (
    <Navbar maxWidth="lg" isBordered>
      <NavbarBrand>
        <Link href="/" className="font-medium text-inherit">
          {APP_NAME}
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="#" color="foreground">
            Job Alerts
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Search Recruiters
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {user ? (
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  endContent={<ChevronDown className="h-4 w-4" />}
                  radius="sm"
                  variant="light"
                >
                  Hi, {user.name}
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem
                key="logout"
                startContent={<LogOutIcon className="h-4 w-4" />}
                onClick={handleLogout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Link color="foreground" href="/auth/login">
              <Button color="default">Log In</Button>
            </Link>
          </NavbarItem>
        )}

        <NavbarItem>
          <Button color="default" variant="flat" disabled>
            For recruiters
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
