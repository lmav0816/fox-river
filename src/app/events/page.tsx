import { getContent } from "@/lib/content";
import { JsonLd } from "@/components/json-ld";
import { EventsPage } from "@/components/events-page";
import { upcomingEvents } from "@/lib/events";
import { eventNodes, structuredData } from "@/lib/seo";

const title = "Campground Events";
const description =
  "Seasonal events and get-togethers at Fox River Recreation, a family-owned campground on the Fox River in Antioch, Illinois.";

// Re-render hourly so events drop off the page after their last day.
export const revalidate = 3600;

// openGraph.title/description inherit the resolved page title and description.
export const metadata = {
  title,
  description,
  alternates: { canonical: "/events" },
  openGraph: { url: "/events" },
};

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <JsonLd
        data={structuredData(
          content,
          { path: "/events", name: title, description, breadcrumb: "Events" },
          eventNodes(upcomingEvents(content.events)),
        )}
      />
      <EventsPage content={content} />
    </>
  );
}
