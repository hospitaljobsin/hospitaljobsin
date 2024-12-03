"use server";
import { APP_NAME } from "@/lib/constants";
import { runWithAmplifyServerContext } from "@/utils/amplify-server-utils";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

export default async function Header() {
  try {
    const authSession = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchAuthSession(contextSpec),
    });
    console.log("authSession", authSession);
  } catch (error) {
    console.error("Error getting current user", error);
  }
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
          <Link color="foreground" href="/auth/login">
            <Button color="primary">Sign in</Button>
          </Link>
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
