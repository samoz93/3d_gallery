import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect } from "react";
import { axiosClient } from "utils/axiosBE";

export default function Page({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {}, []);
  return (
    <>
      {user ? (
        <>
          <h1>id: {user.id}</h1>
          <h1>email: {user.email}</h1>
        </>
      ) : (
        <h1>Not logged in</h1>
      )}
    </>
  );
}

type User = {
  id: string;
  email: string;
};

export const getServerSideProps = (async ({ req }) => {
  try {
    const { data } = await axiosClient.get("/api/users/me", {
      headers: req.headers,
    });
    return {
      props: {
        user: data?.data as User | null,
      },
    };
  } catch (error) {
    throw error;
  }
}) satisfies GetServerSideProps<{
  user: User | null;
}>;
