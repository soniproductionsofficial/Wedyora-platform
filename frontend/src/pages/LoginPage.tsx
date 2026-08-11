import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Button } from "../components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("customer@wedyora.test");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const loggedIn = await login(email, password);
      const redirect = params.get("redirect");
      if (redirect) navigate(redirect);
      else if (loggedIn.role === "vendor") navigate("/vendor");
      else navigate("/customer");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-heading text-3xl font-bold mb-2">Log in</h1>
      <p className="text-sm text-brand-gray mb-6">
        Demo: customer@wedyora.test or vendor@wedyora.test · Password123!
      </p>
      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-brand-line bg-white p-6">
        <label className="block text-xs font-medium">
          Email
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-xs font-medium">
          Password
          <input
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} variant="dark" className="w-full">
          {loading ? "Signing in…" : "Log in"}
        </Button>
      </form>
      <p className="text-sm text-brand-gray mt-4">
        New here?{" "}
        <Link to="/signup" className="text-brand-orange font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}
