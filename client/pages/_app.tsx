import { to } from "await-to-js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from "components/nav";
import { AppContext, AppProps } from "next/app";
import { axiosClient } from "utils/axiosBE";
import "../global.css";
type User = {
  id: string;
  email: string;
};

const App = ({ Component, pageProps, user }: AppProps & { user: User }) => {
  return (
    <>
      <main className="px-4">
        <Nav isLoggedIn={!!user} />
        <div className="mt-4">
          <Component user={user} {...pageProps} />
        </div>
      </main>
    </>
  );
};

declare global {
  interface Window {
    user: User | null;
  }
}

App.getInitialProps = async (context: AppContext) => {
  const req = context.ctx.req;
  const [err, data] = await to(
    axiosClient.get("/api/users/me", {
      headers: req?.headers,
    })
  );

  if (err) {
    console.error("err", err);
  }

  return {
    user: data?.data?.data as User,
  };
};

export default App;
