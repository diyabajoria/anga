import { createFileRoute } from "@tanstack/react-router";
import { AppEntry } from "@/components/AppEntry";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Anga App - Find work, hire workers" },
      {
        name: "description",
        content: "Find local daily-wage work or hire trusted workers near you.",
      },
    ],
  }),
  component: AppEntry,
});
