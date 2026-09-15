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

import { Sell } from "@/pages/Sell";

const { mockActor, authState } = vi.hoisted(() => ({
  mockActor: {
    listVehicles: vi.fn(),
    getVehicle: vi.fn(),
    searchVehicles: vi.fn(),
    createVehicle: vi.fn(),
  },
  authState: { isAuthenticated: true },
}));

vi.mock("@caffeineai/core-infrastructure", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@caffeineai/core-infrastructure")>();
  return {
    ...actual,
    useActor: () => ({ actor: mockActor, isFetching: false }),
    useInternetIdentity: () => ({
      login: vi.fn(),
      clear: vi.fn(),
      isAuthenticated: authState.isAuthenticated,
      isInitializing: false,
      isLoggingIn: false,
      isLoginSuccess: false,
      isLoginError: false,
      loginError: undefined,
      identity: undefined,
    }),
  };
});

function renderSell() {
  const rootRoute = createRootRoute();
  const sellRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/sell",
    component: Sell,
  });
  const routeTree = rootRoute.addChildren([sellRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/sell"] }),
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

describe("Sell page", () => {
  beforeEach(() => {
    mockActor.createVehicle.mockResolvedValue(99n);
    authState.isAuthenticated = true;
  });

  it("shows a sign-in gate when the user is not authenticated", async () => {
    authState.isAuthenticated = false;
    renderSell();

    expect(await screen.findByTestId("sell.sign_in_gate")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in with internet identity/i }),
    ).toBeInTheDocument();
    // The listing form is not shown until the user signs in.
    expect(screen.queryByTestId("sell.title_input")).not.toBeInTheDocument();
  });

  it("renders the listing form", async () => {
    renderSell();

    expect(
      await screen.findByRole("heading", { name: /sell your vehicle/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("sell.title_input")).toBeInTheDocument();
    expect(screen.getByTestId("sell.make_input")).toBeInTheDocument();
    expect(screen.getByTestId("sell.model_input")).toBeInTheDocument();
    expect(screen.getByTestId("sell.year_input")).toBeInTheDocument();
    expect(screen.getByTestId("sell.price_input")).toBeInTheDocument();
    expect(screen.getByTestId("sell.mileage_input")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /publish listing/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when required fields are empty", async () => {
    const user = userEvent.setup();
    renderSell();

    await screen.findByRole("heading", { name: /sell your vehicle/i });
    await user.click(screen.getByRole("button", { name: /publish listing/i }));

    expect(await screen.findByTestId("sell.title_error")).toHaveTextContent(
      "Listing title is required.",
    );
    expect(screen.getByTestId("sell.make_error")).toHaveTextContent(
      "Make is required.",
    );
    expect(screen.getByTestId("sell.model_error")).toHaveTextContent(
      "Model is required.",
    );
    expect(screen.getByTestId("sell.year_error")).toHaveTextContent(
      "Year is required.",
    );
    expect(screen.getByTestId("sell.price_error")).toHaveTextContent(
      "Price is required.",
    );
    expect(screen.getByTestId("sell.mileage_error")).toHaveTextContent(
      "Mileage is required.",
    );

    // No submission happened.
    expect(mockActor.createVehicle).not.toHaveBeenCalled();
  });

  it("submits a valid listing and calls createVehicle", async () => {
    const user = userEvent.setup();
    renderSell();

    await screen.findByRole("heading", { name: /sell your vehicle/i });

    await user.type(screen.getByTestId("sell.title_input"), "2021 BMW M4");
    await user.type(screen.getByTestId("sell.make_input"), "BMW");
    await user.type(screen.getByTestId("sell.model_input"), "M4");
    await user.type(screen.getByTestId("sell.year_input"), "2021");
    await user.type(screen.getByTestId("sell.price_input"), "65000");
    await user.type(screen.getByTestId("sell.mileage_input"), "24500");

    await user.click(screen.getByRole("button", { name: /publish listing/i }));

    await vi.waitFor(() => {
      expect(mockActor.createVehicle).toHaveBeenCalled();
    });

    const submitted = mockActor.createVehicle.mock.calls[0][0];
    expect(submitted.title).toBe("2021 BMW M4");
    expect(submitted.make).toBe("BMW");
    expect(submitted.model).toBe("M4");
    expect(submitted.year).toBe(2021n);
    expect(submitted.price).toBe(65000n);
    expect(submitted.mileage).toBe(24500n);
  });
});
