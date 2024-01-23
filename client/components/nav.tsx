import Link from "next/link";
import Router from "next/router";
import { axiosClient } from "utils/axiosBE";

export const Nav = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const signOut = async () => {
    try {
      await axiosClient.post("/api/users/signout", {});
      Router.reload();
    } catch (error) {
      throw error;
    }
  };
  return (
    <div className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        Home
      </Link>
      {!isLoggedIn ? (
        <div className="flex gap-2">
          <Link className="nav" href="/auth/signin">
            Sign In
          </Link>
          <Link className="nav" href="/auth/signup">
            Sign Up
          </Link>
        </div>
      ) : (
        <Link className="nav" href="#" onClick={signOut}>
          Sign out
        </Link>
      )}
    </div>
  );
};
