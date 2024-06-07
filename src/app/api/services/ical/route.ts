import { NextResponse } from "next/server";
import ical, { ICalCalendarMethod } from "ical-generator";

export async function GET() {
  const calendar = ical({
    name: "My Calendar ehhehe",
    method: ICalCalendarMethod.REQUEST,
  });
  // Example event, you can pull data from your database here
  const startTime = "2024-03-26T00:13:06.000Z";
  const endTime = "2024-03-26T01:13:06.000Z";
  const events = [
    {
      start: startTime,
      end: endTime,
      summary: "Example Event",
      description: "This is an example event",
      location: "800 Howard St., San Francisco, CA 94103",
      url: "http://sebbo.net/",
    },
    // Add more events as needed
  ];
  events.forEach((event) => {
    calendar.createEvent({
      start: event.start,
      end: event.end,
      summary: event.summary,
      description: event.description,
      location: event.location,
    });
  });
  return NextResponse.json(calendar.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename="calendar.ics"`,
    },
  });
}