import Router from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useRequest } from "utils/useRequest";
import { prettifyKey } from "utils/util";

const signup = () => {
  const { data, error, loading, request } = useRequest();
  const [state, setState] = useState<Record<string, string>>({
    email: "test@test.com",
    password: "test",
  });

  const inputs = Object.keys(state);
  const setInput = (key: string, val: string) => {
    setState((state) => ({ ...state, [key]: val }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await request("/api/users/signin", "post", state);
  };

  useEffect(() => {
    if (data) {
      Router.push("/");
    }
  }, [data]);

  return (
    <div className="flex items-center  w-full h-full justify-center">
      <form onSubmit={onSubmit} className="needs-validation w-2/3">
        <h1 className="mb-4">Sign In</h1>
        {inputs.map((input) => {
          const err = error?.reasons?.find((err: any) => err.field === input);

          return (
            <div key={input} className="form-group my-4">
              <input
                className={`form-control shadow-sm ${err ? "is-invalid" : ""}`}
                name={input}
                onChange={(e) => setInput(input, e.target.value)}
                value={state[input]}
                placeholder={prettifyKey(input)}
              ></input>
              {err && <div className="invalid-feedback">{err.message}</div>}
            </div>
          );
        })}

        {error?.message && (
          <div className="alert alert-danger">{error.message}</div>
        )}
        <button disabled={loading} className="btn shadow-md btn-primary mb-4">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default signup;
