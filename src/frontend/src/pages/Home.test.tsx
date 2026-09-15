import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
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

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe("Home page", () => {
  beforeEach(() => {
    mockActor.listVehicles.mockResolvedValue(sampleVehicles);
  });

  it("renders the header, hero, category links, featured vehicles, and footer", async () => {
    renderApp();

    // Wait for the router to render the home page.
    expect(
      await screen.findByRole("heading", { name: /find your next drive/i }),
    ).toBeInTheDocument();

    // Header
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(within(header).getByTestId("header.logo")).toBeInTheDocument();

    // Hero
    expect(
      screen.getByRole("link", { name: /browse inventory/i }),
    ).toBeInTheDocument();

    // Category quick links
    expect(screen.getByText("SUV")).toBeInTheDocument();
    expect(screen.getByText("Sedan")).toBeInTheDocument();
    expect(screen.getByText("Electric")).toBeInTheDocument();

    // Featured vehicles section
    expect(
      screen.getByRole("heading", { name: /featured vehicles/i }),
    ).toBeInTheDocument();

    // Featured vehicles (only featured: true are shown)
    expect(
      await screen.findByText("2022 Tesla Model 3 Long Range"),
    ).toBeInTheDocument();
    expect(screen.getByText("2021 Toyota RAV4 Hybrid XLE")).toBeInTheDocument();
    expect(screen.getByText("2024 BMW 330i Sedan")).toBeInTheDocument();
    // Non-featured vehicle is not shown on the home page
    expect(screen.queryByText("2020 Ford F-150 XLT")).not.toBeInTheDocument();

    // Footer
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("calls listVehicles to load the inventory", async () => {
    renderApp();
    await screen.findByText("2022 Tesla Model 3 Long Range");
    expect(mockActor.listVehicles).toHaveBeenCalled();
  });
});
