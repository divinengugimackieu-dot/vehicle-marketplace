import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BodyType, Condition, FuelType } from "@/lib/api";
import { bodyTypeLabel, conditionLabel, fuelLabel } from "@/lib/format";

const bodyTypes: BodyType[] = [
  BodyType.sedan,
  BodyType.suv,
  BodyType.hatchback,
  BodyType.coupe,
  BodyType.convertible,
  BodyType.pickup,
  BodyType.van,
  BodyType.wagon,
];

const fuelTypes: FuelType[] = [
  FuelType.petrol,
  FuelType.diesel,
  FuelType.electric,
  FuelType.hybrid,
  FuelType.plugInHybrid,
];

const conditions: Condition[] = [
  Condition.new_,
  Condition.used,
  Condition.certifiedPreOwned,
];

const years = Array.from({ length: 25 }, (_, i) => 2026 - i);

export interface FilterValues {
  make: string;
  bodyType: string;
  minPrice: string;
  maxPrice: string;
  year: string;
  fuelType: string;
  condition: string;
}

interface FilterSidebarProps {
  values: FilterValues;
  onChange: (patch: Partial<FilterValues>) => void;
  onReset: () => void;
  activeCount: number;
}

export function FilterSidebar({
  values,
  onChange,
  onReset,
  activeCount,
}: FilterSidebarProps) {
  return (
    <aside
      className="rounded-xl border border-border bg-card p-5 shadow-subtle"
      data-ocid="marketplace.filter_panel"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          Filters
        </h2>
        {activeCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1 text-muted-foreground"
            data-ocid="marketplace.filter_reset_button"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="filter-make">Make</Label>
          <Input
            id="filter-make"
            type="text"
            value={values.make}
            onChange={(e) => onChange({ make: e.target.value })}
            placeholder="e.g. Toyota"
            data-ocid="marketplace.make_input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-body-type">Body type</Label>
          <Select
            value={values.bodyType}
            onValueChange={(v) => onChange({ bodyType: v })}
          >
            <SelectTrigger
              id="filter-body-type"
              className="w-full"
              data-ocid="marketplace.body_type_select"
            >
              <SelectValue placeholder="All body types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All body types</SelectItem>
              {bodyTypes.map((bt) => (
                <SelectItem key={bt} value={bt}>
                  {bodyTypeLabel(bt)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              value={values.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              placeholder="Min"
              aria-label="Minimum price"
              data-ocid="marketplace.min_price_input"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              min={0}
              value={values.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              placeholder="Max"
              aria-label="Maximum price"
              data-ocid="marketplace.max_price_input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-year">Year</Label>
          <Select
            value={values.year}
            onValueChange={(v) => onChange({ year: v })}
          >
            <SelectTrigger
              id="filter-year"
              className="w-full"
              data-ocid="marketplace.year_select"
            >
              <SelectValue placeholder="Any year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any year</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-fuel">Fuel type</Label>
          <Select
            value={values.fuelType}
            onValueChange={(v) => onChange({ fuelType: v })}
          >
            <SelectTrigger
              id="filter-fuel"
              className="w-full"
              data-ocid="marketplace.fuel_select"
            >
              <SelectValue placeholder="All fuel types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fuel types</SelectItem>
              {fuelTypes.map((ft) => (
                <SelectItem key={ft} value={ft}>
                  {fuelLabel(ft)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-condition">Condition</Label>
          <Select
            value={values.condition}
            onValueChange={(v) => onChange({ condition: v })}
          >
            <SelectTrigger
              id="filter-condition"
              className="w-full"
              data-ocid="marketplace.condition_select"
            >
              <SelectValue placeholder="Any condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any condition</SelectItem>
              {conditions.map((c) => (
                <SelectItem key={c} value={c}>
                  {conditionLabel(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-5" />

      <p className="text-xs text-muted-foreground">
        {activeCount > 0
          ? `${activeCount} active filter${activeCount === 1 ? "" : "s"} applied`
          : "No filters applied"}
      </p>
    </aside>
  );
}
