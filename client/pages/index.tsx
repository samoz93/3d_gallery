export default function Page({ user }: { user: User }) {
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
