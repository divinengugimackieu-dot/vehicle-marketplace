import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { VehicleDetail } from "@/pages/VehicleDetail";
import { makeVehicle, sampleVehicles } from "@/test/fixtures";

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

function renderVehicleDetail(id: string) {
  const rootRoute = createRootRoute();
  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/vehicles/$id",
    component: VehicleDetail,
  });
  const routeTree = rootRoute.addChildren([detailRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [`/vehicles/${id}`],
    }),
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe("VehicleDetail page", () => {
  beforeEach(() => {
    mockActor.getVehicle.mockResolvedValue(sampleVehicles[0]);
    mockActor.searchVehicles.mockResolvedValue(sampleVehicles);
  });

  it("renders the vehicle details, specs, and related vehicles", async () => {
    renderVehicleDetail("1");

    // Title and price
    expect(
      await screen.findByRole("heading", {
        name: /2022 tesla model 3 long range/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("$42,900")).toBeInTheDocument();

    // Location and seller contact
    expect(screen.getByText("San Francisco, CA")).toBeInTheDocument();
    expect(screen.getByText("seller@example.com")).toBeInTheDocument();

    // Description
    expect(
      screen.getByText(/dual motor long range with autopilot/i),
    ).toBeInTheDocument();

    // Related vehicles section (excludes the current vehicle)
    expect(
      screen.getByRole("heading", { name: /similar vehicles/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("2021 Toyota RAV4 Hybrid XLE")).toBeInTheDocument();
    expect(screen.getByText("2024 BMW 330i Sedan")).toBeInTheDocument();

    expect(mockActor.getVehicle).toHaveBeenCalledWith(1n);
  });

  it("shows the not-found state when the vehicle does not exist", async () => {
    mockActor.getVehicle.mockResolvedValue(null);
    renderVehicleDetail("999");

    expect(
      await screen.findByTestId("vehicle_detail.not_found"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /vehicle not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to marketplace/i }),
    ).toBeInTheDocument();
  });

  it("shows the featured badge for a featured vehicle", async () => {
    mockActor.getVehicle.mockResolvedValue(
      makeVehicle({ id: 1n, featured: true }),
    );
    renderVehicleDetail("1");

    expect(await screen.findByText("Featured")).toBeInTheDocument();
  });
});
