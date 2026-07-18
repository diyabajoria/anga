import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, MapPin, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PageShell } from "@/components/PageShell";
import { serviceName } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { getSavedJobs, removeSavedJob, type SavedJob } from "@/lib/savedJobs";

export const Route = createFileRoute("/worker/saved")({
  head: () => ({ meta: [{ title: "Anga - Saved jobs" }] }),
  component: SavedJobs,
});

function SavedJobs() {
  const { lang } = useT();
  const [items, setItems] = useState<SavedJob[]>([]);

  useEffect(() => {
    setItems(getSavedJobs());
  }, []);

  const remove = (id: string) => {
    setItems(removeSavedJob(id));
  };

  return (
    <PageShell
      title={lang === "hi" ? "Saved jobs" : "Saved jobs"}
      back="/worker"
      bottomNav={<BottomNav role="worker" />}
    >
      <div className="space-y-3">
        {items.length === 0 && (
          <section className="card-soft p-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-primary/10 text-primary">
              <Bookmark className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-black">
              {lang === "hi" ? "Abhi koi job saved nahi hai" : "No saved jobs yet"}
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              {lang === "hi"
                ? "Job details page par save dabakar important rozgar yahan rakhein."
                : "Save useful jobs from the job details page and they will appear here."}
            </p>
          </section>
        )}

        {items.map((job) => (
          <article key={job.id} className="card-soft p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Bookmark className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-primary">
                  {serviceName(job.service, lang)}
                </p>
                <h2 className="mt-0.5 line-clamp-2 text-lg font-black leading-tight">
                  {job.title}
                </h2>
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {job.location} · {job.distanceKm} km
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(job.id)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
                aria-label={lang === "hi" ? "Remove saved job" : "Remove saved job"}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <span className="rounded-2xl bg-primary/10 px-3 py-2 text-center text-sm font-black text-primary">
                ₹{job.payment}
              </span>
              <span className="rounded-2xl bg-muted px-3 py-2 text-center text-xs font-black">
                {job.time}
              </span>
              <span className="inline-flex items-center justify-center gap-1 rounded-2xl bg-muted px-3 py-2 text-sm font-black">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {job.rating}
              </span>
            </div>

            <Link to="/worker/job/$id" params={{ id: job.id }} className="btn-primary mt-4 w-full">
              {lang === "hi" ? "Details dekhein" : "View details"}
            </Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
