import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PageShell } from "@/components/PageShell";
import { api, type ApiApplication } from "@/lib/api";
import { jobs, services } from "@/lib/data";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/worker/applications")({
  head: () => ({ meta: [{ title: "Anga - My Applications" }] }),
  component: Applications,
});

function Applications() {
  const { t, lang } = useT();
  const [apps, setApps] = useState<ApiApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .myApplications()
      .then((result) => setApps(result.applications))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, []);

  const fallback = jobs.filter((job) => job.status !== "Open");

  return (
    <PageShell title={t("myApps")} back="/worker" bottomNav={<BottomNav role="worker" />}>
      <div className="space-y-3">
        {loading && (
          <p className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
            Loading applications...
          </p>
        )}
        {!loading && apps.length === 0 && fallback.length === 0 && (
          <p className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
            No applications yet
          </p>
        )}
        {apps.length > 0
          ? apps.map((app) => (
              <ApplicationRow
                key={app._id}
                id={app.jobId._id}
                title={app.jobId.title}
                location={app.jobId.location}
                wage={app.jobId.wage}
                service={app.jobId.category}
                status={app.status}
              />
            ))
          : fallback.map((job) => (
              <ApplicationRow
                key={job.id}
                id={job.id}
                title={job.title[lang]}
                location={job.location[lang]}
                wage={job.payment}
                service={job.service}
                status={job.status}
              />
            ))}
      </div>
    </PageShell>
  );
}

function ApplicationRow({
  id,
  title,
  location,
  wage,
  service,
  status,
}: {
  id: string;
  title: string;
  location: string;
  wage: number;
  service: string;
  status: string;
}) {
  const svc = services.find((item) => item.slug === service);
  const statusClass =
    status === "accepted" || status === "Accepted"
      ? "bg-success/15 text-success"
      : status === "rejected" || status === "Rejected"
        ? "bg-destructive/10 text-destructive"
        : "bg-accent/15 text-accent";
  return (
    <Link
      to="/worker/job/$id"
      params={{ id }}
      className="card-soft card-soft-hover flex items-center gap-3 p-4"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10">
        {svc && <svc.icon className="h-6 w-6 text-primary" strokeWidth={2} />}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold">{title}</h3>
        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {location} · ₹{wage}
        </p>
      </div>
      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
        {status}
      </span>
    </Link>
  );
}
