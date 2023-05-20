import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import { prisma } from "src/server/db";

type RsvpRequest = {
  address: string;
  events: Array<string>;
};

export default async function rsvp(req: NextApiRequest, res: NextApiResponse) {
  const { rsvp }: { rsvp: RsvpRequest } = _.pick(req.body, ["rsvp"]);
  if (!rsvp || !rsvp.address || !rsvp.events) {
    throw new Error(`invalid request body: ${JSON.stringify(rsvp)}`);
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: { address: rsvp.address },
  });
  const { id: attendeeId } = user;
  const rsvps = rsvp.events.map((eventId) =>
    prisma.rsvp.upsert({
      where: {
        eventId_attendeeId: {
          eventId,
          attendeeId,
        },
      },
      create: {
        eventId,
        attendeeId,
      },
      update: {
        eventId,
        attendeeId,
      },
    })
  );

  const response = await Promise.all(rsvps);
  const eventIds = response.map((r) => r.eventId);

  console.log(
    `added RSVP for ${JSON.stringify(eventIds)} for user: ${user.address}`
  );

  res.status(200).json({ data: eventIds });
}
