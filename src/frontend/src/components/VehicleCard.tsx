import { Link } from "@tanstack/react-router";
import { CarFront, Gauge } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { VehicleView } from "@/lib/api";
import {
  bodyTypeLabel,
  conditionLabel,
  formatMileage,
  formatPrice,
  formatYear,
} from "@/lib/format";

interface VehicleCardProps {
  vehicle: VehicleView;
  ocidPrefix?: string;
}

export function VehicleCard({
  vehicle,
  ocidPrefix = "marketplace",
}: VehicleCardProps) {
  return (
    <Link
      to="/vehicles/$id"
      params={{ id: vehicle.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated"
      data-ocid={`${ocidPrefix}.card.${vehicle.id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
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
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 rounded-full bg-background/85 backdrop-blur-sm"
        >
          {conditionLabel(vehicle.condition)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug">
            {vehicle.title}
          </h3>
          <Badge variant="outline" className="shrink-0">
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
        </div>
      </div>
    </Link>
  );
}
