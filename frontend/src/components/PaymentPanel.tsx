import { useEffect, useState } from "react";
import { api, formatINR, formatMoney, type ApiError } from "../lib/api";
import { Alert } from "./ui";

interface PayProps {
  kind: "vendor_deposit" | "customer_assignment";
  assignmentId?: string;
  amountHint?: string;
  onPaid?: () => void;
}

export function PaymentPanel({ kind, assignmentId, amountHint, onPaid }: PayProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [config, setConfig] = useState<{
    mockPayments: boolean;
    publishableKey: string;
    vendorDepositAmount: number;
    currency: string;
  } | null>(null);

  useEffect(() => {
    api
      .request<{
        mockPayments: boolean;
        publishableKey: string;
        vendorDepositAmount: number;
        currency: string;
      }>("/api/payments/config", { auth: false })
      .then(setConfig)
      .catch(() => setConfig({ mockPayments: true, publishableKey: "", vendorDepositAmount: 500000, currency: "inr" }));
  }, []);

  async function startPayment() {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      let intent: {
        paymentIntentId: string;
        clientSecret: string | null;
        amount: number;
        currency: string;
        mock?: boolean;
      };

      if (kind === "vendor_deposit") {
        intent = await api.request("/api/vendor/deposit", { method: "POST" });
      } else {
        if (!assignmentId) throw { message: "Missing assignment" } as ApiError;
        intent = await api.request("/api/payments/customer", {
          method: "POST",
          body: JSON.stringify({ assignmentId }),
        });
      }

      if (intent.mock || config?.mockPayments || intent.paymentIntentId.startsWith("pi_mock_")) {
        await api.request("/api/payments/confirm-mock", {
          method: "POST",
          body: JSON.stringify({ paymentIntentId: intent.paymentIntentId }),
        });
        setSuccess(
          `Payment confirmed (demo): ${formatMoney(intent.amount, intent.currency)}`
        );
        onPaid?.();
      } else {
        // Real Stripe: open Elements would go here. For now surface client secret.
        setSuccess(
          `Stripe PaymentIntent created (${intent.paymentIntentId}). Complete with Stripe.js using client secret.`
        );
      }
    } catch (err) {
      setError((err as ApiError).message ?? "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel space-y-3 p-5">
      <h3 className="font-display text-2xl text-brand-purple">
        {kind === "vendor_deposit" ? "Vendor deposit" : "Pay Wedyora"}
      </h3>
      <p className="text-sm text-brand-muted">
        {amountHint ??
          (kind === "vendor_deposit" && config
            ? `Required deposit: ${formatMoney(config.vendorDepositAmount, config.currency)}`
            : "Secure checkout powered by Stripe.")}
      </p>
      {config?.mockPayments && (
        <Alert tone="info">
          Demo mode is on — payments confirm instantly without a live Stripe key.
        </Alert>
      )}
      {error && <Alert tone="error">{error}</Alert>}
      {success && <Alert tone="success">{success}</Alert>}
      <button
        type="button"
        disabled={busy}
        onClick={() => void startPayment()}
        className="btn-gold rounded-xl px-5 py-2.5 disabled:opacity-60"
      >
        {busy ? "Processing…" : kind === "vendor_deposit" ? "Pay deposit" : "Pay now"}
      </button>
    </div>
  );
}

export function Money({ amount }: { amount: number }) {
  return <span>{formatINR(amount)}</span>;
}
