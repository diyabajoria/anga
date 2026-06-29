import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, BadgeCheck, Briefcase, FileCheck, MapPin, Phone, Star } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { serviceName, workers } from "@/lib/data";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/customer/worker/$id")({
  head: () => ({ meta: [{ title: "Anga - Worker profile" }] }),
  component: WorkerProfileDetail,
});

function WorkerProfileDetail() {
  const { id } = Route.useParams();
  const { t, lang } = useT();
  const worker = workers.find((item) => item.id === id) ?? workers[0];

  return (
    <PageShell title={t("workerProfile")} back="/customer">
      <div className="space-y-5">
        <div className="card-soft p-5 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary/10 text-4xl font-extrabold text-primary">
            {worker.name.charAt(0)}
          </div>
          <h2 className="mt-3 text-2xl font-extrabold">{worker.name}</h2>
          <p className="text-sm text-muted-foreground">
            {serviceName(worker.skill, lang)} · {worker.experience}
          </p>
          <div className="mt-3 flex justify-center gap-2 text-xs">
            {worker.verified && (
              <Pill icon={<BadgeCheck className="h-3 w-3" />} text={t("verified")} />
            )}
            {worker.documentUploaded && (
              <Pill icon={<FileCheck className="h-3 w-3" />} text={t("documentUploaded")} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Info
            icon={<Star className="h-4 w-4 fill-current text-amber-500" />}
            label={t("rating")}
            value={`${worker.rating} (${worker.completedJobs})`}
          />
          <Info
            icon={<Briefcase className="h-4 w-4" />}
            label={t("expectedWage")}
            value={`₹${worker.expectedWage}`}
          />
          <Info
            icon={<MapPin className="h-4 w-4" />}
            label={t("location")}
            value={`${worker.area}, ${worker.distanceKm} km`}
          />
          <Info
            icon={<BadgeCheck className="h-4 w-4" />}
            label={t("availableToday")}
            value={worker.availableToday ? "Yes" : "No"}
          />
        </div>

        <div className="card-soft p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {t("description")}
          </h3>
          <p className="mt-2">{worker.bio[lang]}</p>
          <p className="mt-3 text-sm text-muted-foreground">{worker.languages.join(", ")}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <a href={`tel:${worker.phone.replace(/\s/g, "")}`} className="btn-primary px-2 text-xs">
            <Phone className="h-4 w-4" /> {t("call")}
          </a>
          <button
            onClick={() => toast.success(`${worker.name} assigned`)}
            className="btn-outline px-2 text-xs"
          >
            {t("assign")}
          </button>
          <button onClick={() => toast(t("reportIssue"))} className="btn-outline px-2 text-xs">
            <AlertTriangle className="h-4 w-4" /> {t("reportIssue")}
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 font-bold text-success">
      {icon}
      {text}
    </span>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-soft p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-extrabold">{value}</div>
    </div>
  );
}
