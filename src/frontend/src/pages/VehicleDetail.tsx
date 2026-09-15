import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, CarFront, Gauge, MapPin, Phone } from "lucide-react";

import { ImageGallery } from "@/components/ImageGallery";
import { SpecPanel } from "@/components/SpecPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SortField,
  SortOrder,
  type VehicleView,
  emptyFilter,
  useSearchVehicles,
  useVehicle,
} from "@/lib/api";
import {
  bodyTypeLabel,
  formatMileage,
  formatPrice,
  formatYear,
  fuelLabel,
} from "@/lib/format";

function RelatedCard({ vehicle }: { vehicle: VehicleView }) {
  return (
    <Link
      to="/vehicles/$id"
      params={{ id: vehicle.id }}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated"
      data-ocid={`vehicle_detail.related.${vehicle.id}`}
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {vehicle.photos[0] ? (
          <img
            src={vehicle.photos[0].getDirectURL()}
            alt={vehicle.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <CarFront className="size-10" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold">
            {vehicle.title}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {bodyTypeLabel(vehicle.bodyType)}
          </Badge>
        </div>
        <p className="mt-1 font-display text-2xl font-bold text-primary">
          {formatPrice(vehicle.price)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="font-mono">
            {formatYear(vehicle.year)}
          </Badge>
          <Badge variant="outline" className="font-mono">
            <Gauge className="size-3" />
            {formatMileage(vehicle.mileage)}
          </Badge>
          <Badge variant="outline">{fuelLabel(vehicle.fuelType)}</Badge>
        </div>
      </div>
    </Link>
  );
}

export function VehicleDetail() {
  const { id } = useParams({ from: "/vehicles/$id" });
  const vehicleId = BigInt(id);
  const { data: vehicle, isLoading } = useVehicle(vehicleId);

  const relatedQuery = useSearchVehicles({
    filter: {
      ...emptyFilter,
      bodyType: vehicle ? vehicle.bodyType : undefined,
    },
    sortField: SortField.price,
    sortOrder: SortOrder.desc,
  });

  const related = (relatedQuery.data ?? [])
    .filter((v) => v.id !== id)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="container py-12 md:py-16">
        <Skeleton className="mb-8 h-8 w-40" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div
        className="container flex flex-col items-center justify-center py-24 text-center"
        data-ocid="vehicle_detail.not_found"
      >
        <CarFront className="size-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-semibold">
          Vehicle not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          This listing may have been removed from the marketplace.
        </p>
        <Button asChild className="mt-6" data-ocid="vehicle_detail.back_button">
          <Link to="/marketplace" search={{}}>
            <ArrowLeft className="size-4" />
            Back to marketplace
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <Button
        asChild
        variant="ghost"
        className="mb-6 -ml-2"
        data-ocid="vehicle_detail.back_link"
      >
        <Link to="/marketplace" search={{}}>
          <ArrowLeft className="size-4" />
          Back to marketplace
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <ImageGallery photos={vehicle.photos} title={vehicle.title} />

        {/* Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{bodyTypeLabel(vehicle.bodyType)}</Badge>
            {vehicle.featured && (
              <Badge className="bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {vehicle.title}
          </h1>
          <p className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">
            {formatPrice(vehicle.price)}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-subtle">
              <MapPin className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Location
                </p>
                <p className="truncate font-medium">{vehicle.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-subtle">
              <Phone className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Seller contact
                </p>
                <p className="truncate font-medium">{vehicle.sellerContact}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold">Description</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {vehicle.description}
            </p>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-12">
        <SpecPanel vehicle={vehicle} />
      </div>

      {/* Related vehicles */}
      {related.length > 0 && (
        <section className="mt-14" data-ocid="vehicle_detail.related_section">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Similar vehicles
              </h2>
              <p className="mt-1 text-muted-foreground">
                More {bodyTypeLabel(vehicle.bodyType).toLowerCase()}s you might
                like.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="shrink-0"
              data-ocid="vehicle_detail.view_all_button"
            >
              <Link to="/marketplace" search={{}}>
                View all
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((v) => (
              <RelatedCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
