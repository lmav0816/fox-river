import Link from "next/link";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
export const metadata = {
  title: "Terms of Service",
  description:
    "The terms for using the Fox River Recreation website, including rates, reservations, and park rules.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};
export default async function Page() {
  const { contact } = await getContent();
  return (
    <>
      <SiteHeader phone={contact.phone} />
      <main id="main" className="container-wide pb-20">
        <div className="page-intro">
          <p className="eyebrow">Fox River Recreation</p>
          <h1 className="display">Terms of service.</h1>
        </div>
        <div className="max-w-3xl space-y-8 py-12 body-copy">
          <p className="text-sm">Last updated October 21, 2026.</p>
          <section>
            <h2 className="display text-3xl text-foreground mb-4">
              Using this website
            </h2>
            <p>
              This website gives information about Fox River Recreation in
              Antioch, Illinois. By using it, you agree to these terms. If you
              do not agree, please do not use the website.
            </p>
          </section>
          <section>
            <h2 className="display text-3xl text-foreground mb-4">
              Rates and reservations
            </h2>
            <p>
              Rates, season dates, and policies on this website can change
              without notice. The website does not take reservations or
              payments. Reservations are made by calling the office, and the
              rate and terms the office confirms at booking are the ones that
              apply.
            </p>
          </section>
          <section>
            <h2 className="display text-3xl text-foreground mb-4">
              Park rules
            </h2>
            <p>
              Every guest, camper, and visitor must follow the{" "}
              <Link href="/rules" className="underline">
                park rules
              </Link>
              , including the cancellation, visitor, and pet policies. If the
              website and the rules posted at the office differ, the rules at
              the office apply.
            </p>
          </section>
          <section>
            <h2 className="display text-3xl text-foreground mb-4">
              Photos and content
            </h2>
            <p>
              The photos, video, text, and logo on this website belong to Fox
              River Recreation. Please ask before copying or reusing them.
            </p>
          </section>
          <section>
            <h2 className="display text-3xl text-foreground mb-4">
              Other websites
            </h2>
            <p>
              Links to Facebook, Google Maps, and Google reviews open services
              that Fox River Recreation does not control. Their own terms and
              privacy policies apply.
            </p>
          </section>
          <section>
            <h2 className="display text-3xl text-foreground mb-4">
              No guarantees
            </h2>
            <p>
              We work to keep this website accurate and available, but it is
              provided as is. To the extent the law allows, Fox River Recreation
              is not responsible for losses caused by relying on the website or
              by the website being unavailable.
            </p>
          </section>
          <section>
            <h2 className="display text-3xl text-foreground mb-4">
              Changes to these terms
            </h2>
            <p>
              We may update these terms. The date at the top of this page shows
              when they last changed.
            </p>
          </section>
          <section>
            <h2 className="display text-3xl text-foreground mb-4">Questions</h2>
            <p>
              Email{" "}
              <a href={`mailto:${contact.email}`} className="underline">
                {contact.email}
              </a>{" "}
              or call {contact.phone}.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter contact={contact} />
    </>
  );
}
