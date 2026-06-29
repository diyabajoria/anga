import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Plus, Search, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PageShell } from "@/components/PageShell";
import { services, workers } from "@/lib/data";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/customer/")({
  head: () => ({ meta: [{ title: "Anga - Hire local workers" }] }),
  component: CustomerHome,
});

function CustomerHome() {
  const { t, lang } = useT();
  const [q, setQ] = useState("");
  const list = services.filter((service) =>
    (lang === "hi" ? service.hi : service.en).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <PageShell bottomNav={<BottomNav role="customer" />}>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">{t("greeting")}</p>
          <h1 className="text-2xl font-extrabold">{t("whatService")}</h1>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={t("selectService")}
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/customer/request"
            className="card-soft card-soft-hover flex items-center gap-3 bg-primary/5 p-4"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold">{t("newRequest")}</div>
              <div className="text-xs text-muted-foreground">{t("postJob")}</div>
            </div>
          </Link>
          <Link to="/assistant" className="card-soft card-soft-hover flex items-center gap-3 p-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold">{t("assistant")}</div>
              <div className="text-xs text-muted-foreground">Hindi / English</div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {list.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.slug}
                to="/customer/service/$slug"
                params={{ slug: service.slug }}
                className="card-soft card-soft-hover flex flex-col items-center gap-2 p-5 text-center"
              >
                <Icon className="h-10 w-10 text-primary" />
                <span className="text-sm font-bold leading-tight">
                  {lang === "hi" ? service.hi : service.en}
                </span>
              </Link>
            );
          })}
        </div>

        <section>
          <h2 className="mb-3 text-base font-bold">
            {lang === "hi" ? "आज उपलब्ध भरोसेमंद मजदूर" : "Trusted workers available today"}
          </h2>
          <div className="space-y-3">
            {workers
              .filter((worker) => worker.availableToday)
              .slice(0, 2)
              .map((worker) => (
                <Link
                  key={worker.id}
                  to="/customer/worker/$id"
                  params={{ id: worker.id }}
                  className="card-soft card-soft-hover flex items-center gap-3 p-4"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                    {worker.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold">{worker.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {worker.area} · {worker.distanceKm} km · ₹{worker.expectedWage}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-amber-500" /> {worker.rating}
                      </span>
                      {worker.verified && (
                        <span className="flex items-center gap-1 text-success">
                          <ShieldCheck className="h-3 w-3" /> {t("verified")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
