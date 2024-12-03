"use client";
import { APP_NAME } from "@/lib/constants";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import {
  FetchUserAttributesOutput,
  fetchUserAttributes,
} from "aws-amplify/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<FetchUserAttributesOutput | null>(null);

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
            <p>Hi, {user.name}</p>
          ) : (
            <Link color="foreground" href="/auth/login">
              <Button color="primary">Sign in</Button>
            </Link>
          )}
        </NavbarItem>
        <NavbarItem>
          <Button color="primary" variant="flat" disabled>
            For recruiters
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
