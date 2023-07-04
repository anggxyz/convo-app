import type { NextPage } from "next";
import { useRouter } from "next/router";
import ProposeForm, { ClientEventInput } from "src/components/ProposeForm";
import useEvent from "src/hooks/useEvent";
import Main from "src/layouts/Main";
import parse from "src/utils/clientEventToClientEventInput";
import NotFoundPage from "../404";

const Edit: NextPage = () => {
  const { query } = useRouter();
  const { eventHash } = query;
  const { data } = useEvent({ hash: eventHash });

  // check to see if eventHash from query exists in the database
  // parse and pre-fill event data in the form
  const clientEventInput: ClientEventInput | undefined = data
    ? parse(data)
    : undefined;

  if (!clientEventInput) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Main>
        <div className="flex flex-col items-center justify-center">
          <div
            className="
            mx-auto
            font-heading
            text-5xl
            font-extrabold
            text-primary
            sm:text-5xl
          "
          >
            Editing: {clientEventInput?.title}
          </div>
          <div className="my-12 w-full border border-primary lg:w-9/12"></div>
        </div>
        <div className="lg:px-32">
          <ProposeForm event={clientEventInput} />
        </div>
      </Main>
    </>
  );
};
export default Edit;
