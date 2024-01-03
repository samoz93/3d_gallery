"use client";
import { SceneData } from "@samoz/data";
import Link from "next/link";
import { GlowingDiv } from "./GlowingDiv";

export const MainNav = () => {
  const scene = SceneData.filter((scene) => {
    return !scene.isDev ? true : process.env.NODE_ENV === "development";
  });

  return (
    <nav className="p-5 flex flex-col justify-evenly items-stretch text-center gap-5 w-1/8 min-w-12 h-full">
      {scene.map((scene) => (
        <Link
          key={scene.path}
          className="flex cursor-pointer items-center justify-items-center w-full h-full"
          href={`/scenes/${scene.path}`}
        >
          <GlowingDiv>{scene.title}</GlowingDiv>
        </Link>
      ))}
    </nav>
  );
};
