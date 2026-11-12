import { googleReviewsHref } from "./format";
import type { SiteContent } from "./content-schema";

export type NavLink = { label: string; href: string; external?: boolean };

/** The header and footer share one list so the two menus never drift apart. */
export function siteLinks(contact: SiteContent["contact"]): NavLink[] {
  return [
    { label: "Rates", href: "/rates" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Park rules", href: "/rules" },
    { label: "Find us", href: "/#visit" },
    {
      label: "Google reviews",
      href: googleReviewsHref(contact),
      external: true,
    },
    ...(contact.facebookUrl
      ? [{ label: "Facebook", href: contact.facebookUrl, external: true }]
      : []),
  ];
}
