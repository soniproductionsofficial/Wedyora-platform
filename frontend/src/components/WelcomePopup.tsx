import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "./ui";
import { api, money, type Plan } from "../lib/api";

const SEEN_KEY = "wedyora_welcome_v1";

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    api.get("/vendors/plans").then((r) => setPlans(r.data.plans ?? [])).catch(() => {});
  }, [open]);

  function dismiss() {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  return (
    <Modal open={open} onClose={dismiss} title="Welcome to Wedyora">
      <p className="text-sm text-brand-gray mb-5">
        Browse verified wedding vendors, book your event, and let Wedyora assign
        tasks. Vendors pick a plan and pay a refundable deposit to join.
      </p>
      <div className="grid gap-3 mb-5">
        {plans.map((p) => (
          <div key={p.key} className="rounded-2xl border border-brand-line p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="font-heading font-semibold">{p.label}</p>
              <p className="text-xs text-brand-orange font-medium">
                {money(p.deposit)} deposit
              </p>
            </div>
            <p className="text-xs text-brand-gray">
              Registration {money(p.registrationFee)} · {p.features.join(" · ")}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/book" onClick={dismiss}>
          <Button>Book an event</Button>
        </Link>
        <Link to="/signup?role=vendor" onClick={dismiss}>
          <Button variant="ghost">Join as vendor</Button>
        </Link>
      </div>
    </Modal>
  );
}
