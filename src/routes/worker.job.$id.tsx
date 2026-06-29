import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
  Siren,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { api, type ApiJob } from "@/lib/api";
import { jobs as fallbackJobs, serviceName, services } from "@/lib/data";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/worker/job/$id")({
  head: () => ({ meta: [{ title: "Anga - Job details" }] }),
  component: JobDetails,
});

function JobDetails() {
  const { id } = Route.useParams();
  const { t, lang } = useT();
  const navigate = useNavigate();
  const [apiJob, setApiJob] = useState<ApiJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .job(id)
      .then((result) => setApiJob(result.job))
      .catch((err) => setError(err instanceof Error ? err.message : "Using demo job"))
      .finally(() => setLoading(false));
  }, [id]);

  const fallback = fallbackJobs.find((item) => item.id === id);
  const job = apiJob ? mapApiJob(apiJob) : fallback ? mapFallbackJob(fallback, lang) : null;
  if (!job && !loading)
    return (
      <PageShell title="Not found" back="/worker">
        <p>Job not found</p>
      </PageShell>
    );

  const accepted = job?.status === "assigned" || job?.applicationStatus === "accepted";
  const service = job ? services.find((item) => item.slug === job.service) : null;

  const apply = async () => {
    if (!apiJob) {
      toast.success(lang === "hi" ? "आवेदन भेजा गया" : "Application sent");
      navigate({ to: "/worker/applications" });
      return;
    }
    try {
      await api.apply(apiJob._id);
      toast.success(lang === "hi" ? "आवेदन भेजा गया" : "Application sent");
      navigate({ to: "/worker/applications" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not apply");
    }
  };

  return (
    <PageShell title={t("jobDetails")} back="/worker">
      {loading && (
        <p className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
          Loading job...
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-2xl bg-accent/10 p-3 text-xs font-semibold text-accent">
          {error}
        </p>
      )}
      {job && (
        <div className="space-y-5">
          <div className="card-soft p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                {service ? <service.icon className="h-7 w-7" /> : <MapPin className="h-7 w-7" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  {serviceName(job.service, lang)}
                </p>
                <h2 className="text-xl font-extrabold leading-tight">{job.title}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {job.location} · {job.distanceKm} km
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Info
                icon={<Wallet className="h-4 w-4" />}
                label={t("payment")}
                value={`₹${job.payment}`}
              />
              <Info
                icon={<CalendarDays className="h-4 w-4" />}
                label={t("time")}
                value={job.time}
              />
              <Info
                icon={<Users className="h-4 w-4" />}
                label={t("workersNeeded")}
                value={`${job.workersNeeded}`}
              />
              <Info
                icon={<Star className="h-4 w-4 fill-current text-amber-500" />}
                label={t("rating")}
                value={`${job.rating}`}
              />
            </div>
          </div>

          <section className="card-soft p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {t("fullDetails")}
            </h3>
            <p className="mt-2 text-base leading-relaxed">{job.description}</p>
            <div className="mt-4 space-y-2">
              {job.requirements.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card-soft p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {t("customer")}
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                C
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">Verified customer</p>
                <p className="text-xs text-muted-foreground">Local hiring</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                <ShieldCheck className="h-3 w-3" /> {t("verified")}
              </span>
            </div>
          </section>

          {accepted && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toast.error(t("sos"))}
                className="btn-outline border-destructive text-destructive"
              >
                <Siren className="h-4 w-4" /> {t("sos")}
              </button>
              <a href="tel:112" className="btn-outline">
                <Phone className="h-4 w-4" /> {t("emergencyContact")}
              </a>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => toast.success(t("saved"))} className="btn-outline px-2 text-xs">
              <Bookmark className="h-4 w-4" /> {t("saveJob")}
            </button>
            <a href="tel:9000000000" className="btn-outline px-2 text-xs">
              <Phone className="h-4 w-4" /> {t("call")}
            </a>
            <button onClick={() => toast(t("reportIssue"))} className="btn-outline px-2 text-xs">
              <AlertTriangle className="h-4 w-4" /> {t("reportIssue")}
            </button>
          </div>

          <button
            onClick={apply}
            disabled={job.applicationStatus === "pending"}
            className="btn-primary w-full text-lg disabled:opacity-60"
          >
            {job.applicationStatus === "pending" ? "Applied / Pending" : t("apply")}
          </button>
        </div>
      )}
    </PageShell>
  );
}

function mapApiJob(job: ApiJob) {
  return {
    title: job.title,
    service: job.category,
    location: job.location,
    payment: job.wage,
    time: [job.date, job.time].filter(Boolean).join(", ") || "Today",
    workersNeeded: job.workersNeeded,
    rating: 4.7,
    distanceKm: 2.5,
    status: job.status,
    applicationStatus: job.applicationStatus,
    description: job.description,
    requirements: [
      job.urgent ? "Urgent work" : "Daily wage work",
      "Payment after work confirmation",
    ],
  };
}

function mapFallbackJob(job: (typeof fallbackJobs)[number], lang: "en" | "hi") {
  return {
    title: job.title[lang],
    service: job.service,
    location: job.location[lang],
    payment: job.payment,
    time: job.time[lang],
    workersNeeded: job.workersNeeded,
    rating: job.customerRating,
    distanceKm: job.distanceKm,
    status: job.status,
    applicationStatus: null,
    description: job.description[lang],
    requirements: job.requirements.map((item) => item[lang]),
  };
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-extrabold text-foreground">{value}</div>
    </div>
  );
}
