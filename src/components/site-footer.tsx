export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-line bg-brand-black text-white/70 mt-16">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <p>
          <span className="text-white font-heading font-semibold">Wedyora</span>{" "}
          — For Every Moment, Forever.
        </p>
        <p>&copy; {new Date().getFullYear()} Wedyora. All rights reserved.</p>
      </div>
    </footer>
  );
}
