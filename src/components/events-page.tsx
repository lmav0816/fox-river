import type { SiteContent } from "@/lib/content-schema";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Card } from "./ui/card";
import { Tag } from "./ui/tag";
import { phoneHref } from "@/lib/format";
import { formatEventDates, upcomingEvents } from "@/lib/events";
export function EventsPage({ content: c }: { content: SiteContent }) {
  const events = upcomingEvents(c.events);
  return (
    <>
      <SiteHeader phone={c.contact.phone} />
      <main id="main" className="container-wide pb-16">
        <div className="page-intro">
          <p className="eyebrow">Good company, all season long</p>
          <h1 className="display">What&apos;s happening.</h1>
          <p className="body-copy">
            Get-togethers and seasonal events at the campground. Call the office
            with any questions about an event.
          </p>
        </div>
        <div className="mx-auto max-w-4xl py-10">
          {events.length > 0 ? (
            <ul className="grid gap-5" aria-label="Upcoming events">
              {events.map((event, index) => (
                <li key={`${event.startDate}-${event.title}-${index}`}>
                  <Card asChild>
                    <article className="grid gap-4">
                      <Tag>
                        <CalendarDays aria-hidden="true" />
                        {formatEventDates(event)}
                      </Tag>
                      <h2 className="display text-3xl">{event.title}</h2>
                      {event.time && (
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock size={15} aria-hidden="true" />
                          {event.time}
                        </p>
                      )}
                      {event.description && (
                        <p className="body-copy whitespace-pre-line text-sm">
                          {event.description}
                        </p>
                      )}
                    </article>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <div className="callout">
              <h2 className="display text-2xl">
                No events are posted right now.
              </h2>
              <p className="body-copy mt-3 text-sm">
                Check back soon for this season&apos;s get-togethers, or call
                the office to ask what&apos;s coming up.
              </p>
              <a href={phoneHref(c.contact.phone)} className="text-link mt-4">
                Call {c.contact.phone} <ArrowUpRight />
              </a>
            </div>
          )}
          {c.contact.facebookUrl && (
            // A div, because the global reset on <p> outranks Tailwind margins.
            <div className="body-copy mt-10">
              Last-minute changes and park announcements go up on{" "}
              <a
                href={c.contact.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                our Facebook page
              </a>
              .
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-8">
            <Link href="/rates" className="text-link">
              Plan your stay <ArrowUpRight />
            </Link>
            <Link href="/gallery" className="text-link">
              See past get-togethers <ArrowUpRight />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter contact={c.contact} />
    </>
  );
}
