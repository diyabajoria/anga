import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PageShell } from "@/components/PageShell";
import { api, type ApiNotification } from "@/lib/api";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/customer/notifications")({
  head: () => ({ meta: [{ title: "Anga - Notifications" }] }),
  component: Notifs,
});

function Notifs() {
  const { t, lang } = useT();
  const [items, setItems] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .notifications()
      .then((result) => setItems(result.notifications))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell
      title={t("notifications")}
      back="/customer"
      bottomNav={<BottomNav role="customer" />}
    >
      <div className="space-y-3">
        {loading && (
          <p className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
            Loading notifications...
          </p>
        )}
        {!loading && items.length === 0 && (
          <p className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
            {t("noNotifications")}
          </p>
        )}
        {items.map((item) => {
          const Icon = item.type === "application" ? CheckCircle2 : Bell;
          return (
            <div key={item._id} className="card-soft flex items-start gap-3 p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate font-bold">{item.title}</h3>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
