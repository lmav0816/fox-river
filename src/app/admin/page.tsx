import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import { getOwner } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { parseStoredContent } from "@/lib/content-schema";
import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { signIn } from "./actions";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-[18px]">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const owner = await getOwner();
  if (owner) {
    const { data, error } = await owner.client
      .from("site_content")
      .select("id,content,version");
    if (error) throw new Error("Unable to load the owner editor.");
    const draft = data.find((row) => row.id === "draft");
    const published = data.find((row) => row.id === "published");
    return (
      <Editor
        initialContent={parseStoredContent(draft?.content)}
        initialVersion={draft?.version ?? 0}
        publishedVersion={published?.version ?? 0}
        ownerEmail={owner.user.email || "Approved owner"}
      />
    );
  }
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e3ecf6] px-5 py-16">
      <div className="w-full max-w-md rounded-lg border bg-background p-8 sm:p-12">
        <Brand />
        <h1 className="display mt-7 text-4xl">A little upkeep.</h1>
        <p className="body-copy mt-5 text-sm">
          The owner&apos;s space for fresh photos, updated rates, and the
          details that make guests feel welcome.
        </p>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded border border-destructive/30 bg-red-50 p-3 text-sm text-destructive"
          >
            {error === "not-approved"
              ? "This Google account isn't approved to edit the site. Ask the project administrator to add your account."
              : "Sign-in couldn't be completed. Please try again or contact the project administrator."}
          </p>
        )}
        {configured ? (
          <form action={signIn} className="mt-8">
            <Button variant="outline" className="h-12 w-full">
              <GoogleLogo />
              Continue with Google
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              For approved owner accounts only.
            </p>
          </form>
        ) : (
          <div className="mt-7 space-y-4 rounded border bg-card p-4">
            <p className="text-sm leading-6">
              Owner sign-in is not connected yet. The project administrator
              needs to configure Supabase and Google sign-in.
            </p>
            {process.env.NODE_ENV === "development" && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/demo">Try the editor locally</Link>
              </Button>
            )}
          </div>
        )}
        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-xs">
          <ArrowLeft size={14} />
          Back to the campground
        </Link>
      </div>
    </main>
  );
}
