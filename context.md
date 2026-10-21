# Context: October 19, 2026 account and listing review

A review of the services behind foxriverrecreation.com, the changes made, and what is still open. Open follow-ups for listings and DNSSEC are also in [TODO.md](TODO.md).

## Services in use

| Service | Role |
| --- | --- |
| Vercel | Hosts the Next.js site (`fox-river` project, team `fox-river-recreation`) |
| Cloudflare | DNS for the domain (DNS only, not proxied); registrar once the transfer from GoDaddy completes |
| GoDaddy | Current registrar; transfer to Cloudflare in progress |
| Supabase | Owner editor backend (`Website` project, us-east-1) with Google sign-in |
| Google Cloud | OAuth client for Supabase Google sign-in (`fox-river-recreation` project) |
| Google Business Profile | Verified listing for Fox River Recreation |
| Google Search Console | Domain property for foxriverrecreation.com |

## Findings

**Email spoofing.** The domain had no SPF, DKIM, DMARC, or MX records, so anyone could send mail claiming to be from @foxriverrecreation.com. The domain does not send or receive mail; the contact address is a Gmail account.

**Two-factor authentication** is off on Cloudflare, Vercel, and Supabase. Access to all three depends on the owning Google and GitHub sign-ins. Left off for now by decision.

**Supabase.** The Security Advisor reported 0 errors and 9 warnings:

- `save_site_draft` and `publish_site_draft` were executable by the `anon` role. The original migration revoked execute from `public`, but Supabase grants `anon` execute directly through default privileges, so that grant survived. Both functions check owner status and raise an error, so nothing was exposed, but the grant should not exist.
- `rls_auto_enable()` (created by Supabase's automatic-RLS setting) was executable by `anon` and `authenticated`.
- `is_site_owner()` is executable by `anon` on purpose: the published-content read policy calls it for visitors.
- Leaked password protection is off. It does not apply, because email sign-in is disabled.

Only Google sign-in is enabled. The redirect allowlist holds the production callback and `localhost:3100`. All four signed-in accounts are in `site_owners`.

**Cloudflare.** DNSSEC is off. Two leftover `rm_verify` TXT records from the old site builder remained on the root and `www`.

**Vercel.** Both domains are valid, `www` redirects to the apex, HSTS and `X-Frame-Options: DENY` are set, no service-role key is stored, and preview deployments require Vercel login. `SITE_INDEXABLE` applied to Preview as well as Production.

**Google Cloud.** The OAuth client lists only the production origin, `localhost:3100`, and the Supabase callback. The app is in production, with no API keys or service accounts and a single IAM owner.

**Search.** Search Console had no property. Google's indexed copy of the home page dated from a crawl blocked by robots.txt, so search results showed "No information is available for this page".

**Business Profile.** Verified, with 202 reviews. The website field was `http://www.foxriverrecreation.com/` (two redirects). No description, logo, cover photo, social profiles, or attributes. Hours are set for every day of the year even though the park closes after October.

## Changes made

### Cloudflare DNS

- Added restrictive email records through Cloudflare's Email Record Creator:
  - `TXT @` → `v=spf1 -all`
  - `TXT _dmarc` → `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;`
  - `TXT *._domainkey` → `v=DKIM1; p=`
- Deleted both `rm_verify` TXT records.
- Added the Search Console `google-site-verification` TXT record on the root. Keep it, or Search Console loses verification.

If the business ever sends mail from the domain (for example through Google Workspace), update SPF and DMARC first and add the provider's DKIM record.

### Vercel

- `SITE_INDEXABLE` now applies to Production only.

### Supabase

- `supabase/migrations/202610200001_revoke_anon_function_access.sql` revokes `anon` execute on `save_site_draft` and `publish_site_draft`, and revokes execute on `rls_auto_enable()` from `public`, `anon`, and `authenticated` when that function exists. It has been applied to the live project.
- `tests/database.test.ts` now mirrors Supabase's default function grants to `anon` and `authenticated`, runs every migration in order, and asserts that anonymous calls to both functions fail with a permission error. The test fails without the new migration and passes with it.

### Google Search Console

- Added and verified the domain property `foxriverrecreation.com` through a DNS TXT record (no Cloudflare account access granted to Google).
- Submitted `https://foxriverrecreation.com/sitemap.xml`. It processed successfully with 4 pages.
- Requested indexing of the home page; it is in the priority crawl queue.

### Google Business Profile

- Website set to `https://foxriverrecreation.com/`.
- Description added, written only from the website's own copy.
- Facebook page added under social profiles.
- Attributes set from facts stated on the website:
  - Amenities: restroom, running water, public shower.
  - Payments: camping fee, not cash-only, credit cards, Visa, Mastercard.
  - Pets: dogs allowed.
- Logo set to the site's lifebuoy badge, padded on a white square so the circular crop does not clip the rope.
- Cover photo uploaded (the aerial view of the river and RV sites); pending Google review at the time of writing.
- No pending Google-suggested edits on either listing.

Deliberately left alone: hours, opening date, tent sites, accessibility, parking, children, and the "Confirm your info" prompt, because none of these are confirmed. No review replies were posted.

## Still open

1. Turn on DNSSEC after the domain transfer completes. Steps are in [TODO.md](TODO.md).
2. Make the business address match across listings. Details are in [TODO.md](TODO.md).
3. Confirm that every account in `site_owners` should be able to publish the site.
4. Confirm real office hours and season dates with the owners, then set the off-season as closed on the Business Profile.
5. Turn on two-factor authentication for Cloudflare, Vercel, and Supabase when ready.
