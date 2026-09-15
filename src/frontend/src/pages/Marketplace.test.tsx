import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Marketplace } from "@/pages/Marketplace";
import { VehicleDetail } from "@/pages/VehicleDetail";
import { sampleVehicles } from "@/test/fixtures";

const { mockActor } = vi.hoisted(() => ({
  mockActor: {
    listVehicles: vi.fn(),
    getVehicle: vi.fn(),
    searchVehicles: vi.fn(),
    createVehicle: vi.fn(),
  },
}));

vi.mock("@caffeineai/core-infrastructure", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@caffeineai/core-infrastructure")>();
  return {
    ...actual,
    useActor: () => ({ actor: mockActor, isFetching: false }),
  };
});

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

function validateSearch(search: Record<string, unknown>): MarketplaceSearch {
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

function renderMarketplace(initialSearch: Record<string, string> = {}) {
  const rootRoute = createRootRoute();
  const marketplaceRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/marketplace",
    validateSearch,
    component: Marketplace,
  });
  const routeTree = rootRoute.addChildren([marketplaceRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/marketplace"],
    }),
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  // Apply initial search params after mount.
  if (Object.keys(initialSearch).length > 0) {
    void router.navigate({
      to: "/marketplace",
      search: initialSearch as never,
    });
  }

  return { router, ...utils };
}

describe("Marketplace page", () => {
  beforeEach(() => {
    mockActor.searchVehicles.mockResolvedValue(sampleVehicles);
  });

  it("renders the inventory grid and calls searchVehicles", async () => {
    renderMarketplace();

    // Result count reflects the mocked inventory.
    expect(await screen.findByText(/4 vehicles found/i)).toBeInTheDocument();

    // Each vehicle card is rendered.
    expect(
      screen.getByText("2022 Tesla Model 3 Long Range"),
    ).toBeInTheDocument();
    expect(screen.getByText("2021 Toyota RAV4 Hybrid XLE")).toBeInTheDocument();
    expect(screen.getByText("2020 Ford F-150 XLT")).toBeInTheDocument();
    expect(screen.getByText("2024 BMW 330i Sedan")).toBeInTheDocument();

    // The search input and sort controls are present.
    expect(
      screen.getByRole("searchbox", { name: /search vehicles/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("marketplace.sort_select")).toBeInTheDocument();
    expect(
      screen.getByTestId("marketplace.sort_order_button"),
    ).toBeInTheDocument();

    expect(mockActor.searchVehicles).toHaveBeenCalled();
  });

  it("shows the empty state when no vehicles match", async () => {
    mockActor.searchVehicles.mockResolvedValue([]);
    renderMarketplace();

    expect(
      await screen.findByTestId("marketplace.empty_state"),
    ).toBeInTheDocument();
    expect(screen.getByText("No vehicles found")).toBeInTheDocument();
    expect(screen.getByText(/0 vehicles found/i)).toBeInTheDocument();
  });

  it("filters results by keyword search and updates the URL", async () => {
    const user = userEvent.setup();
    renderMarketplace();

    const searchInput = await screen.findByRole("searchbox", {
      name: /search vehicles/i,
    });
    await user.type(searchInput, "Tesla");

    // Debounced navigation updates the URL and re-queries.
    await vi.waitFor(() => {
      expect(mockActor.searchVehicles).toHaveBeenCalled();
    });
    const lastCall =
      mockActor.searchVehicles.mock.calls[
        mockActor.searchVehicles.mock.calls.length - 1
      ][0];
    expect(lastCall.filter.make).toBe("Tesla");
  });

  it("filters by make and updates the URL and query", async () => {
    const user = userEvent.setup();
    const { router } = renderMarketplace();

    await screen.findByText(/4 vehicles found/i);

    await user.type(screen.getByTestId("marketplace.make_input"), "Toyota");

    await vi.waitFor(() => {
      expect(router.state.location.search.make).toBe("Toyota");
    });
    const lastCall =
      mockActor.searchVehicles.mock.calls[
        mockActor.searchVehicles.mock.calls.length - 1
      ][0];
    expect(lastCall.filter.make).toBe("Toyota");
  });

  it("filters by price range and updates the URL and query", async () => {
    const user = userEvent.setup();
    const { router } = renderMarketplace();

    await screen.findByText(/4 vehicles found/i);

    await user.type(screen.getByLabelText("Minimum price"), "30000");
    await user.type(screen.getByLabelText("Maximum price"), "40000");

    await vi.waitFor(() => {
      expect(router.state.location.search.minPrice).toBe("30000");
    });
    const lastCall =
      mockActor.searchVehicles.mock.calls[
        mockActor.searchVehicles.mock.calls.length - 1
      ][0];
    expect(lastCall.filter.minPrice).toBe(30000n);
    expect(lastCall.filter.maxPrice).toBe(40000n);
  });

  it("toggles the sort order and updates the URL", async () => {
    const user = userEvent.setup();
    const { router } = renderMarketplace();

    await screen.findByText(/4 vehicles found/i);

    // Default order is descending; toggling flips it to ascending in the URL.
    await user.click(screen.getByTestId("marketplace.sort_order_button"));

    await vi.waitFor(() => {
      expect(router.state.location.search.order).toBe("asc");
    });
  });

  it("restores filter and sort state from the URL", async () => {
    renderMarketplace({ bodyType: "suv", sort: "year", order: "asc" });

    await screen.findByText(/4 vehicles found/i);

    const lastCall =
      mockActor.searchVehicles.mock.calls[
        mockActor.searchVehicles.mock.calls.length - 1
      ][0];
    expect(lastCall.filter.bodyType).toBe("suv");
    expect(lastCall.sortField).toBe("year");
    expect(lastCall.sortOrder).toBe("asc");
  });

  it("restores year, fuel type, and condition filters from the URL", async () => {
    renderMarketplace({
      year: "2022",
      fuelType: "electric",
      condition: "used",
    });

    await screen.findByText(/4 vehicles found/i);

    const lastCall =
      mockActor.searchVehicles.mock.calls[
        mockActor.searchVehicles.mock.calls.length - 1
      ][0];
    expect(lastCall.filter.year).toBe(2022n);
    expect(lastCall.filter.fuelType).toBe("electric");
    expect(lastCall.filter.condition).toBe("used");
  });

  it("restores the sort field from the URL", async () => {
    renderMarketplace({ sort: "mileage", order: "desc" });

    await screen.findByText(/4 vehicles found/i);

    const lastCall =
      mockActor.searchVehicles.mock.calls[
        mockActor.searchVehicles.mock.calls.length - 1
      ][0];
    expect(lastCall.sortField).toBe("mileage");
    expect(lastCall.sortOrder).toBe("desc");
  });

  it("opens the detail page when a listing card is clicked", async () => {
    const user = userEvent.setup();
    mockActor.getVehicle.mockResolvedValue(sampleVehicles[0]);

    const rootRoute = createRootRoute();
    const marketplaceRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/marketplace",
      validateSearch,
      component: Marketplace,
    });
    const detailRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/vehicles/$id",
      component: VehicleDetail,
    });
    const routeTree = rootRoute.addChildren([marketplaceRoute, detailRoute]);
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ["/marketplace"] }),
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    await screen.findByText(/4 vehicles found/i);

    // Click the first listing card.
    await user.click(screen.getByTestId("marketplace.card.1"));

    // The detail page loads the selected vehicle.
    expect(
      await screen.findByRole("heading", {
        name: /2022 tesla model 3 long range/i,
      }),
    ).toBeInTheDocument();
    expect(mockActor.getVehicle).toHaveBeenCalledWith(1n);
  });
});
