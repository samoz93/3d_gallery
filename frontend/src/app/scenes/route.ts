import { SceneData } from "@samoz/data";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const data = SceneData[0];
  redirect(`/scenes/${data.path}`);
}
