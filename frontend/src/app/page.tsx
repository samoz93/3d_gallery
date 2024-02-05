"use client";

export default function Home() {
  const test = () => {
    fetch("/api", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
      // mode: "no-cors",
    })
      .then((res) => {
        return res.text();
      })
      .then((data) => {})
      .catch((err) => {});
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 h-full glass_gradient">
      <h1 onClick={test} className="text-5xl">
        Welcome to My 3D Gallery
      </h1>
      <p className="text-2xl text-center">
        This project is a template for my <i>Threejs</i> projects, it is meant
        to show case the power of{" "}
        <b>
          <i>glsl</i>
        </b>{" "}
        shaders in creating amazing visual effects
        <br />
        <br />
        You can start by choosing a scene from the left menu
      </p>
      <a className="text-2xl" href="" />
    </main>
  );
}
