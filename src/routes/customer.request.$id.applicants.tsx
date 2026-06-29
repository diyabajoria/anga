import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, FileCheck, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { api, type ApiWorkerProfile } from "@/lib/api";
import { serviceName, workers } from "@/lib/data";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/customer/request/$id/applicants")({
  head: () => ({ meta: [{ title: "Anga - Applicants" }] }),
  component: Applicants,
});

function Applicants() {
  const { id } = Route.useParams();
  const { t, lang } = useT();
  const [jobTitle, setJobTitle] = useState("");
  const [service, setService] = useState("");
  const [applicants, setApplicants] = useState<
    Array<{ applicationId: string; workerId: string; worker: ApiWorkerProfile }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .applicants(id)
      .then((result) => {
        setJobTitle(result.job.title);
        setService(result.job.category);
        setApplicants(
          result.applicants
            .filter((item) => item.worker)
            .map((item) => ({
              applicationId: item.application._id,
              workerId: item.application.workerId,
              worker: item.worker!,
            })),
        );
      })
      .catch(() => setApplicants([]))
      .finally(() => setLoading(false));
  }, [id]);

  const fallback = workers.slice(0, 2);

  return (
    <PageShell title={t("viewApplicants")} back="/customer/my-requests">
      <div className="space-y-4">
        <div className="card-soft bg-primary/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            {service ? serviceName(service, lang) : t("applicants")}
          </p>
          <h2 className="mt-1 text-lg font-extrabold">{jobTitle || "Posted job"}</h2>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${applicants.length || fallback.length} ${t("applicants")}`}
          </p>
        </div>

        {!loading && applicants.length === 0 && (
          <p className="rounded-2xl bg-muted p-4 text-center text-sm text-muted-foreground">
            No applicants yet. Showing demo workers.
          </p>
        )}

        {applicants.length > 0
          ? applicants.map((item) => (
              <ApplicantCard
                key={item.applicationId}
                jobId={id}
                workerId={item.workerId}
                worker={item.worker}
              />
            ))
          : fallback.map((worker) => (
              <ApplicantCard
                key={worker.id}
                jobId={id}
                workerId={worker.id}
                worker={{
                  _id: worker.id,
                  userId: worker.id,
                  name: worker.name,
                  phone: worker.phone,
                  skills: [worker.skill],
                  experience: worker.experience,
                  expectedWage: worker.expectedWage,
                  availableToday: worker.availableToday,
                  preferredDistance: "5 km",
                  location: worker.area,
                  documentsUploaded: worker.documentUploaded,
                  verified: worker.verified,
                  rating: worker.rating,
                  totalJobsCompleted: worker.completedJobs,
                }}
                demo
              />
            ))}
      </div>
    </PageShell>
  );
}

function ApplicantCard({
  jobId,
  workerId,
  worker,
  demo,
}: {
  jobId: string;
  workerId: string;
  worker: ApiWorkerProfile;
  demo?: boolean;
}) {
  const { t, lang } = useT();
  const assign = async () => {
    if (demo) return toast.success(`${worker.name} assigned`);
    try {
      await api.assign(jobId, workerId);
      toast.success(`${worker.name} assigned`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not assign worker");
    }
  };
  return (
    <div className="card-soft p-4">
      <Link
        to="/customer/worker/$id"
        params={{ id: worker.userId }}
        className="flex items-start gap-3"
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-extrabold text-primary">
          {worker.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold">{worker.name}</h3>
          <p className="text-sm text-muted-foreground">
            {serviceName(worker.skills[0], lang)} · {worker.experience} · {worker.location}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 font-semibold">
              <Star className="h-3 w-3 fill-current text-amber-500" /> {worker.rating}
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-1 font-bold text-primary">
              ₹{worker.expectedWage}
            </span>
            {worker.verified && (
              <Pill icon={<BadgeCheck className="h-3 w-3" />} text={t("verified")} />
            )}
            {worker.documentsUploaded && (
              <Pill icon={<FileCheck className="h-3 w-3" />} text={t("documentUploaded")} />
            )}
          </div>
        </div>
      </Link>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <a href={`tel:${worker.phone.replace(/\s/g, "")}`} className="btn-outline">
          <Phone className="h-4 w-4" /> {t("call")}
        </a>
        <button onClick={assign} className="btn-primary">
          {t("assign")}
        </button>
      </div>
    </div>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 font-semibold text-success">
      {icon}
      {text}
    </span>
  );
}
