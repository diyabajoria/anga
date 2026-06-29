import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { setAuthMode } from "@/lib/session";

export const Route = createFileRoute("/login")({
  component: LoginRedirect,
});

function LoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    setAuthMode("login");
    navigate({ to: "/role-selection", replace: true });
  }, [navigate]);

  return null;
}
