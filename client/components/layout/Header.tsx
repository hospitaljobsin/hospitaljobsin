"use client";
import { getGravatarURL } from "@/lib/avatars";
import { APP_NAME } from "@/lib/constants";
import {
  Avatar,
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
import { ChevronDown, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { HeaderQuery as HeaderQueryType } from "./__generated__/HeaderQuery.graphql";

const HeaderQuery = graphql`
  query HeaderQuery {
    viewer {
      ... on Account {
        __typename
        email
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
  }
`;

const HeaderLogoutMutation = graphql`
  mutation HeaderLogoutMutation {
    logout {
      ...on Account {
        id @deleteRecord
      }
    }
  }
`;

export default function Header() {
  const data = useLazyLoadQuery<HeaderQueryType>(HeaderQuery, {});
    const [commitMutation, isMutationInFlight] = useMutation(HeaderLogoutMutation);
  const router = useRouter();

  async function handleLogout() {
    commitMutation({variables: {}, onCompleted(response, errors) {
        if (!errors) {
          router.replace("/auth/login");
        }
    },})
  }

  return (
    <Navbar maxWidth="lg" isBordered>
      <NavbarBrand>
        <Link href="/" className="font-medium text-inherit">
          {APP_NAME}
        </Link>
      </NavbarBrand>
      
      <NavbarContent justify="end">
        {data.viewer?.__typename === "Account" ? (
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
                  <Avatar name={data.viewer.email} size="sm" src={getGravatarURL(data.viewer.email)} /> {data.viewer.email}
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
                className="min-w-72"
                startContent={<LogOutIcon className="h-4 w-4" />}
                onClick={handleLogout}
                isDisabled={isMutationInFlight}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
          <NavbarItem>
            <Link color="foreground" href="/auth/login">
              <Button color="default">Log In</Button>
            </Link>
          </NavbarItem> <NavbarItem>
          <Button color="default" variant="flat" disabled>
            For recruiters
          </Button>
        </NavbarItem></>
        )}

       
      </NavbarContent>
    </Navbar>
  );
}
