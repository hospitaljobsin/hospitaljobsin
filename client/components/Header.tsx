"use server";
import { APP_NAME } from "@/lib/constants";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { cookies } from "next/headers";

export default async function Header() {
  const user = await authenticatedUser({ cookies });
  return (
    <Navbar maxWidth="xl" isBordered>
      <NavbarBrand>
        <Link href="/" color="foreground">
          <p className="font-bold text-inherit">{APP_NAME}</p>
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
        <NavbarItem className="hidden lg:flex">
          {user ? (
            <p>Hi, {user.userId}</p>
          ) : (
            <Link color="foreground" href="/auth/login">
              <Button color="primary">Sign in</Button>
            </Link>
          )}
        </NavbarItem>
        <NavbarItem>
          <Button color="primary" variant="flat">
            For recruiters
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
