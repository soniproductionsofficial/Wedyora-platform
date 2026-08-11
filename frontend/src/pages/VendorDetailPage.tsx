import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { api, money, type Vendor } from "../lib/api";
import { Button, Skeleton } from "../components/ui";

export default function VendorDetailPage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [services, setServices] = useState<
    { id: string; name: string; description: string; price: number }[]
  >([]);
  const [reviews, setReviews] = useState<{ rating: number; comment: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/vendors/${id}`)
      .then((r) => {
        setVendor(r.data.vendor);
        setServices(r.data.services ?? []);
        setReviews(r.data.reviews ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Skeleton className="h-64 mb-6" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!vendor) {
    return <p className="p-10 text-center text-brand-gray">Vendor not found.</p>;
  }

  return (
    <div>
      <div className="bg-brand-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-brand-gold-bright text-xs uppercase tracking-[0.18em] mb-2">
              {vendor.category}
            </p>
            <h1 className="font-heading text-3xl font-bold mb-3">{vendor.businessName}</h1>
            <p className="text-white/75 mb-4">{vendor.bio}</p>
            <p className="text-sm flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-brand-gold-bright fill-brand-gold-bright" />
                {vendor.rating} ({vendor.reviewCount})
              </span>
              <span className="inline-flex items-center gap-1 text-white/70">
                <MapPin className="h-4 w-4" /> {vendor.city}
              </span>
            </p>
            <Link to={`/book?vendorId=${vendor.id}&category=${encodeURIComponent(vendor.category)}`} className="inline-block mt-6">
              <Button>Book this vendor</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {vendor.portfolioUrls.slice(0, 4).map((url) => (
              <img key={url} src={url} alt="" className="rounded-2xl h-36 w-full object-cover" />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="font-heading text-xl font-semibold mb-4">Pricing</h2>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.id} className="rounded-2xl border border-brand-line bg-white p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-brand-gray mt-1">{s.description}</p>
                  </div>
                  <p className="font-semibold text-sm whitespace-nowrap">{money(s.price)}</p>
                </div>
              </li>
            ))}
            {services.length === 0 && (
              <p className="text-sm text-brand-gray">
                From {money(vendor.priceMin)} – {money(vendor.priceMax)}
              </p>
            )}
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-brand-gray">No reviews yet.</p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r, i) => (
                <li key={i} className="rounded-2xl border border-brand-line bg-white p-4 text-sm">
                  <p className="font-medium mb-1">{r.rating}/5</p>
                  <p className="text-brand-gray">{r.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
