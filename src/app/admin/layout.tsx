// Passthrough: auth chrome lives in (panel)/layout so /admin/login stays public.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
