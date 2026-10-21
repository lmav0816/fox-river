import { describe, expect, it } from "vitest";
import type { SiteEvent } from "../src/lib/content-schema";
import {
  formatEventDates,
  todayAtPark,
  upcomingEvents,
} from "../src/lib/events";

const event = (startDate: string, endDate = ""): SiteEvent => ({
  title: startDate,
  startDate,
  endDate,
  time: "",
  description: "",
});

describe("events", () => {
  it("reads today in the park's time zone", () => {
    // 1 am UTC on July 5 is still the evening of July 4 in Antioch.
    expect(todayAtPark(new Date("2027-07-05T01:00:00Z"))).toBe("2027-07-04");
  });

  it("shows events through their last day, soonest first", () => {
    const events = [
      event("2027-08-01"),
      event("2027-07-03", "2027-07-05"),
      event("2027-07-01"),
      event("2027-07-05"),
    ];
    expect(
      upcomingEvents(events, "2027-07-05").map((e) => e.startDate),
    ).toEqual(["2027-07-03", "2027-07-05", "2027-08-01"]);
  });

  it("formats single days and ranges without shifting the date", () => {
    expect(formatEventDates(event("2027-07-04"))).toBe("Sun, July 4");
    expect(formatEventDates(event("2027-07-03", "2027-07-05"))).toMatch(
      /^Sat, July 3\s–\sMon, July 5$/,
    );
  });
});
