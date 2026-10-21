import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { JsonLd } from "@/components/json-ld";
import { GalleryPage } from "@/components/gallery-page";
import { structuredData } from "@/lib/seo";

const title = "Photo Gallery";
const description =
  "Photos from Fox River Recreation in Antioch, Illinois: the pool, the river and docks, campsites, and get-togethers at the campground.";

export async function generateMetadata(): Promise<Metadata> {
  const { gallery } = await getContent();
  return {
    title,
    description,
    alternates: { canonical: "/gallery" },
    // openGraph.title/description inherit the resolved page title and description.
    openGraph: {
      url: "/gallery",
      images: [{ url: gallery[0].src, alt: gallery[0].alt }],
    },
  };
}

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <JsonLd
        data={structuredData(content, {
          path: "/gallery",
          name: title,
          description,
          breadcrumb: "Gallery",
        })}
      />
      <GalleryPage content={content} />
    </>
  );
}
