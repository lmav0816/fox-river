"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { phoneHref } from "@/lib/format";
import { siteLinks, type NavLink } from "@/lib/nav";
import type { SiteContent } from "@/lib/content-schema";
import { Brand } from "./brand";

function NavItem({
  link,
  className,
  onClick,
}: {
  link: NavLink;
  className?: string;
  onClick?: () => void;
}) {
  if (link.external)
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        onClick={onClick}
      >
        {link.label} ↗
      </a>
    );
  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {link.label}
    </Link>
  );
}

export function SiteHeader({ contact }: { contact: SiteContent["contact"] }) {
  const [open, setOpen] = useState(false);
  const links = siteLinks(contact);
  return (
    <header>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        A FAMILY-OWNED CAMPGROUND. A RIVER FULL OF POSSIBILITIES.
      </div>
      <div className="container-wide site-nav">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
          <a className="nav-call" href={phoneHref(contact.phone)}>
            <Phone size={15} />
            Call us
          </a>
        </nav>
        <div className="mobile-nav">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="p-2" aria-label="Open navigation">
              <Menu size={26} />
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogTitle className="font-serif text-3xl">
                Make yourself at home.
              </DialogTitle>
              <DialogDescription>
                Explore Fox River Recreation.
              </DialogDescription>
              <nav
                className="flex flex-col gap-5 py-5"
                aria-label="Mobile navigation"
              >
                {links.map((link) => (
                  <NavItem
                    key={link.href}
                    link={link}
                    onClick={() => setOpen(false)}
                    className="border-b pb-3"
                  />
                ))}
                <a
                  href={phoneHref(contact.phone)}
                  className="flex items-center gap-3"
                >
                  <Phone size={18} />
                  {contact.phone}
                </a>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
