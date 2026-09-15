import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryCharging,
  Car,
  CarFront,
  Gem,
  Truck,
  Zap,
} from "lucide-react";

import { VehicleCard } from "@/components/VehicleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicles } from "@/lib/api";

const categories = [
  { label: "SUV", icon: CarFront, search: { bodyType: "suv" } },
  { label: "Sedan", icon: Car, search: { bodyType: "sedan" } },
  { label: "Truck", icon: Truck, search: { bodyType: "pickup" } },
  {
    label: "Electric",
    icon: BatteryCharging,
    search: { fuelType: "electric" },
  },
  { label: "Luxury", icon: Gem, search: { minPrice: "40000" } },
  { label: "Performance", icon: Zap, search: { bodyType: "coupe" } },
] as const;

export function Home() {
  const { data: vehicles, isLoading } = useVehicles();
  const featured = (vehicles ?? []).filter((v) => v.featured).slice(0, 6);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-hero-glow">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <Badge
              variant="secondary"
              className="mb-5 rounded-full px-3 py-1"
              data-ocid="home.hero_badge"
            >
              Premium automotive marketplace
            </Badge>
            <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
              Find your <span className="text-primary">next drive</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Browse a curated inventory of quality vehicles from trusted
              sellers. Every listing is verified, every drive is yours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-lg"
                data-ocid="home.browse_button"
              >
                <Link to="/marketplace" search={{}}>
                  Browse Inventory
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg"
                data-ocid="home.sell_button"
              >
                <Link to="/sell" search={{}}>
                  Sell your vehicle
                </Link>
              </Button>
            </div>
          </div>

          <div className="animate-fade-up overflow-hidden rounded-2xl border border-border shadow-elevated">
            <img
              src="/assets/generated/hero-sports-car.dim_1600x900.jpg"
              alt="A sleek black sports car with red pinstripe accents parked in a dark, reflective studio"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Category quick links */}
      <section className="border-y bg-muted/30">
        <div className="container py-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.label}
                  to="/marketplace"
                  search={category.search}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated"
                  data-ocid={`home.category.${category.label.toLowerCase()}`}
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-sm font-semibold">
                    {category.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="container py-16 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
              Featured vehicles
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hand-picked inventory from our showroom floor.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden sm:inline-flex"
            data-ocid="home.view_all_button"
          >
            <Link to="/marketplace" search={{}}>
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((id) => (
              <Card key={id} className="overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <CardContent className="space-y-3 pt-5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-7 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center"
            data-ocid="home.featured_empty_state"
          >
            <CarFront className="size-12 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-semibold">
              Inventory is on its way
            </h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Our showroom is being stocked. Check back soon or browse the full
              marketplace.
            </p>
            <Button
              asChild
              className="mt-6"
              data-ocid="home.empty_browse_button"
            >
              <Link to="/marketplace" search={{}}>
                Browse marketplace
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((vehicle) => (
              <VehicleCard
                key={vehicle.id.toString()}
                vehicle={vehicle}
                ocidPrefix="home"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
