import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from "components/nav";
import { AppContext, AppProps } from "next/app";
import "../global.css";

const App = ({ Component, pageProps, isLoggedIn }: AppProps) => {
  return (
    <>
      <main className="px-4">
        <Nav isLoggedIn={isLoggedIn} />
        <div className="mt-4">
          <Component {...pageProps} />
        </div>
      </main>
    </>
  );
};

App.getInitialProps = async (context: AppContext) => {
  return {
    isLoggedIn: !!context.ctx.req?.cookies["session"],
  };
};

export default App;
