import { createClient } from "@/lib/supabase/server";
import { markContactMessageStatusAction } from "@/lib/actions/contact";

const STATUS_STYLE: Record<string, string> = {
  new: "bg-yellow-50 text-yellow-700",
  read: "bg-blue-50 text-blue-700",
  resolved: "bg-green-50 text-green-700",
};

export default async function AdminContactMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <p className="text-brand-gray text-sm mb-8">
        Messages submitted through the public Contact Us form.
      </p>

      {!messages || messages.length === 0 ? (
        <p className="text-brand-gray text-sm">No messages yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-xl border border-brand-line bg-white p-5 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-brand-gray">
                    {[m.email, m.phone].filter(Boolean).join(" · ")}
                    {" · "}
                    {new Date(m.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    STATUS_STYLE[m.status] ?? "bg-brand-cream text-brand-gray"
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <p className="text-brand-gray mb-3 whitespace-pre-wrap">{m.message}</p>
              <div className="flex gap-2">
                {m.status !== "read" && (
                  <form action={markContactMessageStatusAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="status" value="read" />
                    <button
                      type="submit"
                      className="text-xs font-semibold px-3 py-1 rounded-full border border-brand-line hover:bg-brand-cream"
                    >
                      Mark Read
                    </button>
                  </form>
                )}
                {m.status !== "resolved" && (
                  <form action={markContactMessageStatusAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="status" value="resolved" />
                    <button
                      type="submit"
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-green-600 text-white hover:bg-green-700"
                    >
                      Mark Resolved
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
