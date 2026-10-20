# TODO

## Make the address match across listings

The website uses `27884 W. Route 173, Antioch, IL 60002`. Other listings spell it differently, which weakens the match search engines make between them. Pick one form and use it everywhere. Google may insist on its own format for the Business Profile, in which case match the others to Google's.

| Listing | Address as shown (October 19, 2026) |
| --- | --- |
| Website | 27884 W. Route 173, Antioch, IL 60002 |
| Google Business Profile | 27884 Illinois 173, Antioch, Illinois 60002 (shown as 27884 IL-173) |
| Yelp | 27884 W Rte 173, Antioch, IL 60002 |
| Good Sam | 27884 W Rte 173, Antioch, IL |
| MapQuest | 27884 W Il Route 173, Antioch, IL 60002-8275 |
| RVezy | 27884 IL-173, Antioch |

Not yet checked: Tripadvisor, Hipcamp, Apple Maps, Bing Places. While updating each listing, also set its website link to `https://foxriverrecreation.com`.

## Turn on DNSSEC after the domain transfer

The domain is moving from GoDaddy to Cloudflare Registrar. Once Cloudflare shows the transfer as complete under Domains → Transfers:

1. In Cloudflare, open foxriverrecreation.com → DNS → Settings and click **Enable DNSSEC**.
2. Cloudflare Registrar publishes the DS record itself. Confirm it with `dig +short DS foxriverrecreation.com`, which should return a record within a few hours.
