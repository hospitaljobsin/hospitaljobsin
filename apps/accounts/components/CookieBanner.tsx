"use client";
import type { CookieBannerConsentQuery as CookieBannerConsentQueryType } from "@/__generated__/CookieBannerConsentQuery.graphql";
import links from "@/lib/links";
import { Button } from "@heroui/react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";
import { cookieConsentGiven, setCookieConsent } from "../lib/cookie-consent";
import useIsAuthenticated from "../lib/hooks/useIsAuthenticated";
// GraphQL query to fetch viewer with analytics preference
export const CookieBannerConsentQuery = graphql`
  query CookieBannerConsentQuery {
    viewer {
      __typename
      ... on Account {
        __typename
        id
        analyticsPreference {
          type
        }
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
  }
`;

export default function CookieBanner() {
	const pathname = usePathname();
	const { isAuthenticated } = useIsAuthenticated();
	const [consentGiven, setConsentGiven] = useState<string>("undecided");
	const [isOpen, setIsOpen] = useState(false);
	const [queryReference, loadQuery, disposeQuery] =
		useQueryLoader<CookieBannerConsentQueryType>(CookieBannerConsentQuery);

	// Check browser cookie first - if it exists, use it and skip server request
	useEffect(() => {
		const browserConsent = cookieConsentGiven();
		if (browserConsent !== "undecided") {
			// User has already made a choice, use browser cookie
			setConsentGiven(browserConsent);
		} else if (isAuthenticated && !queryReference) {
			// No browser cookie and user is authenticated, fetch from server
			loadQuery({});
		} else if (!isAuthenticated) {
			// Anonymous user with no browser cookie
			setConsentGiven("undecided");
		}
	}, [isAuthenticated, loadQuery, queryReference]);

	// Show banner only if consent is undecided
	useEffect(() => {
		if (consentGiven === "undecided") {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	}, [consentGiven]);

	// Configure PostHog based on consent
	useEffect(() => {
		if (consentGiven !== "") {
			posthog.set_config({
				persistence: consentGiven === "yes" ? "localStorage+cookie" : "memory",
			});
		}
	}, [consentGiven]);

	const handleAcceptCookies = async () => {
		try {
			await setCookieConsent("yes");
			setConsentGiven("yes");
			setIsOpen(false);
		} catch (error) {
			console.error("Failed to set cookie consent:", error);
		}
	};

	const handleDeclineCookies = async () => {
		try {
			await setCookieConsent("no");
			setConsentGiven("no");
			setIsOpen(false);
		} catch (error) {
			console.error("Failed to set cookie consent:", error);
		}
	};

	if (pathname === links.settingsPrivacy) {
		return null;
	}

	// For authenticated users with query reference, render the content component
	if (isAuthenticated && queryReference) {
		return (
			<CookieBannerContent
				queryReference={queryReference}
				disposeQuery={disposeQuery}
				consentGiven={consentGiven}
				setConsentGiven={setConsentGiven}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				handleAcceptCookies={handleAcceptCookies}
				handleDeclineCookies={handleDeclineCookies}
			/>
		);
	}

	// For anonymous users or when browser cookie is already set, render the modal directly
	return (
		<CookieBannerModal
			isOpen={isOpen}
			handleAcceptCookies={handleAcceptCookies}
			handleDeclineCookies={handleDeclineCookies}
		/>
	);
}

// Component to handle authenticated user data
function CookieBannerContent({
	queryReference,
	setConsentGiven,
	isOpen,
	handleAcceptCookies,
	handleDeclineCookies,
}: {
	queryReference: PreloadedQuery<CookieBannerConsentQueryType>;
	disposeQuery: () => void;
	consentGiven: string;
	setConsentGiven: (consent: string) => void;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	handleAcceptCookies: () => Promise<void>;
	handleDeclineCookies: () => Promise<void>;
}) {
	const data = usePreloadedQuery(CookieBannerConsentQuery, queryReference);

	// Determine consent status from server data
	useEffect(() => {
		if (data.viewer.__typename === "Account") {
			const consentType = data.viewer.analyticsPreference.type;
			// Map server enum to local consent format
			const consentMap: Record<string, string> = {
				ACCEPTANCE: "yes",
				REJECTION: "no",
				UNDECIDED: "undecided",
			};
			setConsentGiven(consentMap[consentType] || "undecided");
			if (
				consentMap[consentType] === "yes" ||
				consentMap[consentType] === "no"
			) {
				setCookieConsent(consentMap[consentType]);
			}
		}
	}, [data.viewer, setConsentGiven]);

	return (
		<CookieBannerModal
			isOpen={isOpen}
			handleAcceptCookies={handleAcceptCookies}
			handleDeclineCookies={handleDeclineCookies}
		/>
	);
}

// Modal component
function CookieBannerModal({
	isOpen,
	handleAcceptCookies,
	handleDeclineCookies,
}: {
	isOpen: boolean;
	handleAcceptCookies: () => Promise<void>;
	handleDeclineCookies: () => Promise<void>;
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed bottom-8 right-4 max-w-md bg-white border border-gray-200 shadow-lg rounded-lg px-6 py-4 z-50">
			<h3 className="text-sm font-medium text-gray-900 pb-2">
				Help us improve your experience
			</h3>
			<p className="text-xs text-gray-600 pb-3">
				We use cookies and similar technologies to make our site work, remember
				your preferences, and measure traffic.
			</p>
			<div className="flex gap-2 justify-end">
				<Button
					size="sm"
					color="default"
					variant="light"
					onPress={handleDeclineCookies}
					className="text-xs"
				>
					Reject all
				</Button>
				<Button
					size="sm"
					color="primary"
					onPress={handleAcceptCookies}
					className="text-xs"
				>
					Accept all
				</Button>
			</div>
		</div>
	);
}
