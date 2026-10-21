import type { SiteContent } from "@/lib/content-schema";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Gallery } from "./gallery";
export function GalleryPage({ content: c }: { content: SiteContent }) {
  return (
    <>
      <SiteHeader phone={c.contact.phone} />
      <main id="main" className="container-wide pb-24">
        <div className="page-intro">
          <p className="eyebrow">Life by the river</p>
          <h1 className="display">This is the good part.</h1>
          <p className="body-copy">
            Summer afternoons at the pool, boats at the docks, and get-togethers
            with the people who come back year after year.
          </p>
        </div>
        <div className="pt-12">
          <Gallery images={c.gallery} />
        </div>
        <div className="mt-16 flex flex-wrap gap-8">
          <Link href="/rates" className="text-link">
            Find your stay <ArrowUpRight />
          </Link>
          <Link href="/events" className="text-link">
            See what&apos;s happening <ArrowUpRight />
          </Link>
        </div>
      </main>
      <SiteFooter contact={c.contact} />
    </>
  );
}
