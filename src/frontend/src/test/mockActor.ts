import { vi } from "vitest";

import type { Backend } from "@/backend";
import type { Vehicle, VehicleQuery } from "@/lib/api";

export interface MockActor {
  listVehicles: ReturnType<typeof vi.fn>;
  getVehicle: ReturnType<typeof vi.fn>;
  searchVehicles: ReturnType<typeof vi.fn>;
  createVehicle: ReturnType<typeof vi.fn>;
}

/**
 * Builds a typed mock actor whose methods resolve to the provided fixtures.
 * `useActor` is mocked in each test file to return this actor.
 */
export function createMockActor(vehicles: Vehicle[]): MockActor {
  return {
    listVehicles: vi.fn(async () => vehicles),
    getVehicle: vi.fn(
      async (id: bigint) => vehicles.find((v) => v.id === id) ?? null,
    ),
    searchVehicles: vi.fn(async (_query: VehicleQuery) => vehicles),
    createVehicle: vi.fn(async () => 99n),
  };
}

/**
 * The shape `useActor` returns. `actor` is the mock backend; `isFetching` is
 * false so the react-query queries are enabled immediately.
 */
export function actorResult(actor: MockActor) {
  return { actor: actor as unknown as Backend, isFetching: false };
}
