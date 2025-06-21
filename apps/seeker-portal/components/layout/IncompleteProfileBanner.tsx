import type { IncompleteProfileBannerFragment$key } from "@/__generated__/IncompleteProfileBannerFragment.graphql";
import links from "@/lib/links";
import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const IncompleteProfileBannerFragment = graphql`
fragment IncompleteProfileBannerFragment on Account {
	profile @required(action: THROW) {
		isComplete
	}
}
`;

export default function IncompleteProfileBanner({
	account,
}: {
	account: IncompleteProfileBannerFragment$key;
}) {
	const pathName = usePathname();
	const data = useFragment(IncompleteProfileBannerFragment, account);
	if (data.profile.isComplete || pathName === links.profile) return null;
	return (
		<div className="w-full bg-primary-300 py-4">
			<div className="max-w-7xl mx-auto px-5 flex items-center justify-between gap-6 text-shadow-primary-foreground">
				<p>Please complete your profile to apply for jobs.</p>
				<Button variant="solid" color="primary" as={Link} href={links.profile}>
					Complete Profile
				</Button>
			</div>
		</div>
	);
}
