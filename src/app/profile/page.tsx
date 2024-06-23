"use client";

import type { NextPage } from "next";
import { useUser } from "src/context/UserContext";
import Main from "src/layouts/Main";
import { PenLine } from "lucide-react";
import useProfile from "src/hooks/useProfile";
import { useEffect, useState } from "react";
import { Button } from "src/components/ui/button";
import type { Profile as ProfileType, User } from "@prisma/client";

const Profile: NextPage = () => {
  const { fetchedUser } = useUser();
  const { data: profile } = useProfile({ userId: fetchedUser.id });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileAttributes, setProfileAttributes] =
    useState<Partial<ProfileType>>(profile);
  const [userAttributes, setUserAttributes] =
    useState<Partial<User>>(fetchedUser);

  useEffect(() => {
    if (profile) {
      setProfileAttributes(profile);
    }
    if (fetchedUser) {
      setUserAttributes(fetchedUser);
    }
  }, [profile]);

  const onSubmit = () => {
    // todo
    console.log(profileAttributes);
    console.log(userAttributes);
    setIsEditing(false);
  };
  return (
    <>
      <Main>
        <div
          className="
          pl-6
          md:px-12
          lg:px-64
        "
        >
          <div className="grid grid-cols-1 gap-6">
            <div
              className="flex w-max cursor-pointer flex-row items-center rounded-md bg-slate-200 p-1 hover:bg-slate-300"
              onClick={() => setIsEditing(true)}
            >
              <div className="text-sm uppercase">Edit</div>
              <PenLine size={"18"} />
            </div>
            <div className="flex w-full flex-col gap-6">
              <div className="grid grid-cols-2 items-center gap-6">
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      className="
                      font-heading
                      text-5xl
                      font-bold
                      lowercase
                      text-primary

                    "
                      placeholder={userAttributes.nickname}
                      onChange={(event) => {
                        return setUserAttributes((curr) => {
                          return {
                            ...curr,
                            nickname: event.target.value,
                          };
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="
                              font-heading
                              text-5xl
                              font-bold
                              lowercase
                              text-primary

                            "
                  >
                    {userAttributes.nickname}
                  </div>
                )}
                <div className="justify-self-end">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile?.photo || ""}
                    width={180}
                    height={180}
                    alt="pfp"
                    className="rounded-full"
                  />
                </div>
              </div>
              {isEditing ? (
                <div>
                  <textarea
                    wrap="soft"
                    className="w-full"
                    placeholder={profileAttributes?.bio || ""}
                    onChange={(event) => {
                      return setProfileAttributes((curr) => {
                        return {
                          ...curr,
                          bio: event.target.value,
                        };
                      });
                    }}
                  />
                </div>
              ) : (
                <div>{profileAttributes?.bio}</div>
              )}
            </div>
            <Button onClick={() => onSubmit()} disabled={!isEditing}>
              Update Profile
            </Button>
          </div>
        </div>
      </Main>
    </>
  );
};

export default Profile;
