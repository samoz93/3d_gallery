"use client";
import { SceneData } from "@samoz/data";
import Link from "next/link";
import { GlowingDiv } from "./GlowingDiv";

export const MainNav = () => {
  const scene = SceneData.filter((scene) => {
    return !scene.isDev ? true : process.env.NODE_ENV === "development";
  });

  return (
    <nav className="p-5 flex-col text-center w-1/9 min-w-12 h-full overflow-scroll">
      {scene.reverse().map((scene) => (
        <Link
          key={scene.path}
          className="flex cursor-pointer h-40 mt-5 items-center justify-items-center"
          href={`/scenes/${scene.path}`}
        >
          <GlowingDiv>{scene.title}</GlowingDiv>
        </Link>
      ))}
    </nav>
  );
};
