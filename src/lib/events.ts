import type { SiteEvent } from "./content-schema";

// Event dates are calendar days at the park, not instants, so "today" is read
// in the park's time zone and dates are formatted in UTC to avoid a day shift.
const parkDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
});
const eventDay = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** Today's date at the campground, as YYYY-MM-DD. */
export function todayAtPark(now = new Date()) {
  return parkDay.format(now);
}

/** Events that haven't ended yet, soonest first. Past events hide themselves. */
export function upcomingEvents(events: SiteEvent[], today = todayAtPark()) {
  return events
    .filter((event) => (event.endDate || event.startDate) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function formatEventDates(event: SiteEvent) {
  const start = new Date(`${event.startDate}T00:00:00Z`);
  if (!event.endDate || event.endDate === event.startDate)
    return eventDay.format(start);
  return eventDay.formatRange(start, new Date(`${event.endDate}T00:00:00Z`));
}
