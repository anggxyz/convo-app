import { useEffect, useState } from "react";
import type { Session as ClientSession } from "src/types";
import { isPast, getDateTimeString, sortSessions } from "src/utils/dateTime";
import { useRsvpIntention } from "src/context/RsvpIntentionContext";
import Session from "./Session";
import { Button } from "src/components/ui/button";
import { useUser } from "src/context/UserContext";
import useUpdateRsvp from "src/hooks/useUpdateRsvp";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "../ui/credenza";
import useEventsFromId from "src/hooks/useEventsFromId";
import { ScrollArea } from "src/components/ui/scroll-area";
export const SessionsWrapper = ({
  sessions,
}: {
  sessions: ClientSession[];
}) => {
  const { rsvpIntention, setRsvpIntention } = useRsvpIntention();
  const {
    sessions: sortedSessions,
    active,
    inactiveSessions,
  } = sortSessions(sessions);
  const { fetchedUser: user } = useUser();
  const [openModalFlag, setOpenModalFlag] = useState(false);
  const [cancelRsvpEventId, setCancelRsvpEventId] = useState<
    string | undefined
  >(undefined);
  const openModal = () => setOpenModalFlag(true);
  const handleSessionSelect = (
    id: string,
    checked: boolean,
    isEdit: boolean
  ) => {
    if (isEdit) {
      // open modal to handle rsvp edit
      setCancelRsvpEventId(() => id);
      openModal();
    }
    switch (checked) {
      case true:
        setRsvpIntention({
          ...rsvpIntention,
          eventIds: [...rsvpIntention.eventIds, id],
        });
        break;
      case false:
        setRsvpIntention({
          ...rsvpIntention,
          eventIds: rsvpIntention.eventIds.filter((r) => r !== id),
        });
        break;
      default: {
        throw new Error(`unknown value for checked: ${checked}`);
      }
    }
  };
  useEffect(() => {
    setRsvpIntention({
      ...rsvpIntention,
      eventIds: active
        .filter((event) => event.availableSeats > 0 || event.noLimit)
        .map((a) => a.id),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);
  const { isLoading, data } = useEventsFromId({
    ids: [cancelRsvpEventId ?? ""],
  });
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const onClickCancel = async () => {
    setIsDeleting(true);
    try {
      await updateRsvp();
    } catch (err) {
      setIsDeleting(false);
      console.error("There was an Error", JSON.stringify(err));
      return;
    }
    setIsDeleting(false);
    setOpenModalFlag(false);
  };

  const { fetch: updateRsvp } = useUpdateRsvp({
    userId: user.id,
    eventId: cancelRsvpEventId,
    toRsvp: false,
  });
  return (
    <>
      <Credenza open={openModalFlag} onOpenChange={setOpenModalFlag}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Remove RSVP from Convo?</CredenzaTitle>
            <CredenzaDescription>
              Confirm to remove your RSVP from the selected Convo
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            {data && data.sessions && data.sessions[0] && (
              <div>
                Your RSVP will be removed from:
                <div>
                  {getDateTimeString(
                    new Date(data.sessions[0].startDateTime).toISOString(),
                    "date"
                  )}
                  ,{" "}
                  {getDateTimeString(
                    new Date(data.sessions[0].startDateTime).toISOString(),
                    "time"
                  )}
                </div>
              </div>
            )}
          </CredenzaBody>
          <CredenzaFooter>
            <div className="flex w-full flex-col gap-1">
              <Button
                onClick={() => onClickCancel()}
                className="w-full"
                isLoading={isLoading || isDeleting}
              >
                Confirm
              </Button>
            </div>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
      <div className="w-100 [&>*]:my-3">
        {active.map((session, key) => {
          const active =
            (session.noLimit && !isPast(session.startDateTime)) ||
            (session.availableSeats > 0 && !isPast(session.startDateTime));
          return (
            <Session
              handleClick={handleSessionSelect}
              key={key}
              data={session.id}
              date={getDateTimeString(session.startDateTime, "date")}
              time={getDateTimeString(session.startDateTime, "time")}
              availableSeats={session.availableSeats}
              totalSeats={session.limit}
              noLimit={session.noLimit}
              isChecked={active}
              startDateTime={session.startDateTime}
            />
          );
        })}
        <div className="font-primary">Other sessions:</div>
        <ScrollArea className="h-[150px] w-[100%] rounded-md border p-4">
          {inactiveSessions.map((session, key) => {
            return (
              <Session
                handleClick={handleSessionSelect}
                key={key}
                data={session.id}
                date={getDateTimeString(session.startDateTime, "date")}
                time={getDateTimeString(session.startDateTime, "time")}
                availableSeats={session.availableSeats}
                totalSeats={session.limit}
                noLimit={session.noLimit}
                isChecked={false}
                startDateTime={session.startDateTime}
              />
            );
          })}
        </ScrollArea>
        <div className="font-secondary text-sm font-light lowercase">
          in your local timezone&nbsp;
          <span className="font-semibold">
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </span>
        </div>
      </div>
    </>
  );
};
