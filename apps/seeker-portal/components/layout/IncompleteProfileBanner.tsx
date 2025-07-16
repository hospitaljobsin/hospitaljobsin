import type { IncompleteProfileBannerFragment$key } from "@/__generated__/IncompleteProfileBannerFragment.graphql";
import links from "@/lib/links";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const IncompleteProfileBannerFragment = graphql`
fragment IncompleteProfileBannerFragment on Account {
	id
	profile @required(action: THROW) {
		isComplete
	}
}
`;

export default function IncompleteProfileBanner({
	account,
	animate = true,
}: {
	account: IncompleteProfileBannerFragment$key;
	animate?: boolean;
}) {
	const pathName = usePathname();
	const data = useFragment(IncompleteProfileBannerFragment, account);
	if (data.profile.isComplete || pathName === links.profile) return null;
	const Container = animate ? motion.div : "div";
	return (
		<Container
			{...(animate
				? {
						initial: { y: -100, opacity: 0 },
						animate: { y: 0, opacity: 1 },
						exit: { y: -100, opacity: 0 },
						transition: { type: "tween", stiffness: 400, damping: 30 },
					}
				: {})}
			className="w-full bg-primary-200 py-4"
		>
			<div className="max-w-7xl mx-auto px-5 flex items-center justify-between gap-6 text-shadow-primary-foreground text-xs sm:text-base">
				<p>Please complete your profile to apply for jobs.</p>
				<Button
					variant="solid"
					size="sm"
					className="min-w-36 text-xs sm:hidden"
					color="primary"
					as={Link}
					href={links.profile}
				>
					Complete Profile
				</Button>
				<Button
					variant="solid"
					className="min-w-36 hidden sm:flex"
					color="primary"
					as={Link}
					href={links.profile}
				>
					Complete Profile
				</Button>
			</div>
		</Container>
	);
}
