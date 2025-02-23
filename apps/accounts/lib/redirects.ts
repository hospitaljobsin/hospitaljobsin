import { env } from "./env";
import links from "./links";

// validate redirect to URLs to prevent open redirect attacks
// https://thecopenhagenbook.com/open-redirect
export function getValidRedirectURL(redirectTo: string | null): string {
  if (redirectTo === null) {
    return links.seekerLanding;
  }

  if (redirectTo.startsWith(env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL) || redirectTo.startsWith(env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL)) {
    return redirectTo;
  }

  return links.seekerLanding;
}