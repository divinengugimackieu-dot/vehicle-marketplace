import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CarFront,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { FilterSidebar, type FilterValues } from "@/components/FilterSidebar";
import { VehicleCard } from "@/components/VehicleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type BodyType,
  type Condition,
  type FuelType,
  type SortField,
  type SortOrder,
  type VehicleFilter,
  emptyFilter,
  useSearchVehicles,
} from "@/lib/api";

type SortFieldKind = "price" | "year" | "mileage";
type SortOrderKind = "asc" | "desc";

const sortFields: { value: SortFieldKind; label: string }[] = [
  { value: "price", label: "Price" },
  { value: "year", label: "Year" },
  { value: "mileage", label: "Mileage" },
];

function toSortField(kind: SortFieldKind): SortField {
  return kind as SortField;
}

function toSortOrder(kind: SortOrderKind): SortOrder {
  return kind as SortOrder;
}

export function Marketplace() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/marketplace" });

  const [query, setQuery] = useState(search.q ?? "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const values: FilterValues = {
    make: search.make ?? "",
    bodyType: search.bodyType ?? "all",
    minPrice: search.minPrice ?? "",
    maxPrice: search.maxPrice ?? "",
    year: search.year ?? "all",
    fuelType: search.fuelType ?? "all",
    condition: search.condition ?? "all",
  };

  const sortField: SortFieldKind =
    search.sort === "year" || search.sort === "mileage" ? search.sort : "price";
  const sortOrder: SortOrderKind = search.order === "asc" ? "asc" : "desc";

  const urlQuery = search.q ?? "";

  // Debounced live keyword search -> URL
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query !== urlQuery) {
        void navigate({
          to: "/marketplace",
          search: { ...search, q: query || undefined },
        });
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, urlQuery, navigate, search]);

  const makeFilter = values.make || query;

  const filter: VehicleFilter = {
    ...emptyFilter,
    make: makeFilter || undefined,
    bodyType:
      values.bodyType === "all" ? undefined : (values.bodyType as BodyType),
    minPrice: values.minPrice ? BigInt(values.minPrice) : undefined,
    maxPrice: values.maxPrice ? BigInt(values.maxPrice) : undefined,
    year: values.year === "all" ? undefined : BigInt(values.year),
    fuelType:
      values.fuelType === "all" ? undefined : (values.fuelType as FuelType),
    condition:
      values.condition === "all" ? undefined : (values.condition as Condition),
  };

  const { data: vehicles, isLoading } = useSearchVehicles({
    filter,
    sortField: toSortField(sortField),
    sortOrder: toSortOrder(sortOrder),
  });

  const activeCount = [
    values.make,
    values.bodyType !== "all" ? values.bodyType : "",
    values.minPrice,
    values.maxPrice,
    values.year !== "all" ? values.year : "",
    values.fuelType !== "all" ? values.fuelType : "",
    values.condition !== "all" ? values.condition : "",
    query,
  ].filter(Boolean).length;

  const updateSearch = (patch: Partial<FilterValues>) => {
    const next = { ...values, ...patch };
    void navigate({
      to: "/marketplace",
      search: {
        ...search,
        q: query || undefined,
        make: next.make || undefined,
        bodyType: next.bodyType === "all" ? undefined : next.bodyType,
        minPrice: next.minPrice || undefined,
        maxPrice: next.maxPrice || undefined,
        year: next.year === "all" ? undefined : next.year,
        fuelType: next.fuelType === "all" ? undefined : next.fuelType,
        condition: next.condition === "all" ? undefined : next.condition,
      },
    });
  };

  const resetFilters = () => {
    setQuery("");
    void navigate({ to: "/marketplace", search: {} });
  };

  const changeSortField = (kind: SortFieldKind) => {
    void navigate({
      to: "/marketplace",
      search: { ...search, sort: kind, order: sortOrder },
    });
  };

  const toggleSortOrder = () => {
    void navigate({
      to: "/marketplace",
      search: {
        ...search,
        sort: sortField,
        order: sortOrder === "asc" ? "desc" : "asc",
      },
    });
  };

  const filterSidebar = (
    <FilterSidebar
      values={values}
      onChange={updateSearch}
      onReset={resetFilters}
      activeCount={activeCount}
    />
  );

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Marketplace
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse our full inventory of quality vehicles.
        </p>
      </div>

      {/* Search + sort toolbar */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-subtle lg:flex-row lg:items-center">
        <form onSubmit={(e) => e.preventDefault()} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by make, model, or title…"
            className="pl-9"
            data-ocid="marketplace.search_input"
            aria-label="Search vehicles"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
            data-ocid="marketplace.filters_toggle"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeCount}
              </Badge>
            )}
          </Button>

          <Select
            value={sortField}
            onValueChange={(v) => changeSortField(v as SortFieldKind)}
          >
            <SelectTrigger className="w-40" data-ocid="marketplace.sort_select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortFields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={toggleSortOrder}
            aria-label={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
            data-ocid="marketplace.sort_order_button"
          >
            {sortOrder === "asc" ? (
              <ArrowUpNarrowWide className="size-4" />
            ) : (
              <ArrowDownWideNarrow className="size-4" />
            )}
            {sortOrder === "asc" ? "Low to high" : "High to low"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">{filterSidebar}</div>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading vehicles…"
                : `${(vehicles ?? []).length} vehicle${(vehicles ?? []).length === 1 ? "" : "s"} found`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map(
                (id) => (
                  <Card key={id} className="overflow-hidden">
                    <Skeleton className="aspect-[16/10] w-full rounded-none" />
                    <CardContent className="space-y-3 pt-5">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-7 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          ) : (vehicles ?? []).length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center"
              data-ocid="marketplace.empty_state"
            >
              <CarFront className="size-12 text-muted-foreground" />
              <h3 className="mt-4 font-display text-xl font-semibold">
                No vehicles found
              </h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                Try adjusting your filters or search terms to find more results.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-6"
                onClick={resetFilters}
                data-ocid="marketplace.reset_button"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {(vehicles ?? []).map((vehicle) => (
                <VehicleCard key={vehicle.id.toString()} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent
          side="left"
          className="w-[320px] overflow-y-auto p-0 sm:max-w-none"
        >
          <SheetHeader className="border-b px-5 py-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 font-display">
                <SlidersHorizontal className="size-4" />
                Filters
              </SheetTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                data-ocid="marketplace.filters_close_button"
              >
                <X className="size-5" />
              </Button>
            </div>
          </SheetHeader>
          <div className="p-5">{filterSidebar}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
