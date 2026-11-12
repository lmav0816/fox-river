import Link from "next/link";
import { Brand } from "./brand";
import { formatAddress } from "@/lib/format";
import { siteLinks } from "@/lib/nav";
import { siteName } from "@/lib/site";
import type { SiteContent } from "@/lib/content-schema";
export function SiteFooter({ contact }: { contact: SiteContent["contact"] }) {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-top">
          <div>
            <Brand />
            <p className="mt-5 text-xs text-[#b9cbe4]">
              Good days. Great company. Life by the river.
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {siteLinks(contact).map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} ↗
                </a>
              ) : (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {siteName} ·{" "}
            {formatAddress(contact.address)}
          </span>
          <span className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
