import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Marketplace } from "@/pages/Marketplace";
import { Sell } from "@/pages/Sell";
import { VehicleDetail } from "@/pages/VehicleDetail";

interface MarketplaceSearch {
  q?: string;
  make?: string;
  bodyType?: string;
  minPrice?: string;
  maxPrice?: string;
  year?: string;
  fuelType?: string;
  condition?: string;
  sort?: string;
  order?: string;
}

function validateMarketplaceSearch(
  search: Record<string, unknown>,
): MarketplaceSearch {
  const str = (value: unknown): string | undefined =>
    typeof value === "string" && value.length > 0 ? value : undefined;
  return {
    q: str(search.q),
    make: str(search.make),
    bodyType: str(search.bodyType),
    minPrice: str(search.minPrice),
    maxPrice: str(search.maxPrice),
    year: str(search.year),
    fuelType: str(search.fuelType),
    condition: str(search.condition),
    sort: str(search.sort),
    order: str(search.order),
  };
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace",
  validateSearch: validateMarketplaceSearch,
  component: Marketplace,
});

const vehicleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vehicles/$id",
  component: VehicleDetail,
});

const sellRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sell",
  component: Sell,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  marketplaceRoute,
  vehicleDetailRoute,
  sellRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
