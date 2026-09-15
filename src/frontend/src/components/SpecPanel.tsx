import { Badge } from "@/components/ui/badge";
import type { VehicleView } from "@/lib/api";
import {
  bodyTypeLabel,
  conditionLabel,
  drivetrainLabel,
  formatMileage,
  formatVin,
  formatYear,
  fuelLabel,
  transmissionLabel,
} from "@/lib/format";

interface SpecPanelProps {
  vehicle: VehicleView;
}

export function SpecPanel({ vehicle }: SpecPanelProps) {
  const specs = [
    { label: "Year", value: formatYear(vehicle.year) },
    { label: "Mileage", value: formatMileage(vehicle.mileage) },
    { label: "Fuel type", value: fuelLabel(vehicle.fuelType) },
    { label: "Transmission", value: transmissionLabel(vehicle.transmission) },
    { label: "Drivetrain", value: drivetrainLabel(vehicle.drivetrain) },
    { label: "Color", value: vehicle.color },
    { label: "Condition", value: conditionLabel(vehicle.condition) },
    { label: "Body type", value: bodyTypeLabel(vehicle.bodyType) },
    { label: "VIN", value: formatVin(vehicle.vin) },
  ];

  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 shadow-subtle"
      data-ocid="spec_panel"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Specifications</h2>
        <Badge variant="secondary">{conditionLabel(vehicle.condition)}</Badge>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-center justify-between gap-4 border-b border-border pb-3"
          >
            <dt className="text-sm text-muted-foreground">{spec.label}</dt>
            <dd className="text-right font-mono text-sm font-medium">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
      {vehicle.sellerNotes && (
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Seller notes
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {vehicle.sellerNotes}
          </p>
        </div>
      )}
    </div>
  );
}
