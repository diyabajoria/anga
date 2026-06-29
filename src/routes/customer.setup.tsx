import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, Home, Store } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { getPhone, saveProfile, setProfileComplete, setRole } from "@/lib/session";

export const Route = createFileRoute("/customer/setup")({
  head: () => ({ meta: [{ title: "Anga - Customer setup" }] }),
  component: CustomerSetup,
});

function CustomerSetup() {
  const { t, lang } = useT();
  const navigate = useNavigate();
  const [ownerType, setOwnerType] = useState("homeowner");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const profile = {
      name: data.get("name"),
      phone: data.get("phone"),
      address: data.get("address"),
      customerType: ownerType,
    };
    try {
      setRole("customer");
      await api.saveCustomerProfile(profile);
      saveProfile("customer", profile);
      setProfileComplete("customer", true);
      toast.success(lang === "hi" ? "प्रोफाइल तैयार है" : "Profile ready");
      navigate({ to: "/customer" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save profile");
    }
  };

  const types = [
    { value: "homeowner", label: lang === "hi" ? "घर मालिक" : "Homeowner", icon: Home },
    { value: "shop_owner", label: lang === "hi" ? "दुकान मालिक" : "Shop owner", icon: Store },
    { value: "contractor", label: lang === "hi" ? "कॉन्ट्रैक्टर" : "Contractor", icon: Building2 },
  ];

  return (
    <PageShell title={t("customerSetup")} back="/auth/otp">
      <form onSubmit={submit} className="space-y-4">
        <Field label={t("name")}>
          <Input name="name" placeholder="Anita Patel" required />
        </Field>
        <Field label={t("phone")}>
          <Input name="phone" defaultValue={getPhone()} required />
        </Field>
        <Field label={t("address")}>
          <LocationAutocomplete name="address" placeholder="Koramangala, Bengaluru" required />
        </Field>

        <Field label={t("ownerType")}>
          <div className="grid gap-2">
            {types.map((type) => {
              const Icon = type.icon;
              const active = ownerType === type.value;
              return (
                <button
                  type="button"
                  key={type.value}
                  onClick={() => setOwnerType(type.value)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-semibold ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="card-soft bg-primary/5 p-4 text-sm font-medium text-primary">
          {lang === "hi"
            ? "आपको सत्यापित मजदूर, रेटिंग और कॉल/असाइन विकल्प मिलेंगे।"
            : "You will see verified workers, ratings, and quick call/assign actions."}
        </div>

        <button type="submit" className="btn-primary w-full text-lg">
          {t("startHiring")}
        </button>
      </form>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex min-h-10 items-end text-sm font-semibold leading-tight">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="field" />;
}
