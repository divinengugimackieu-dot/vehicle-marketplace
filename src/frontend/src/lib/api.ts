import {
  type BodyType,
  type Condition,
  type Drivetrain,
  type FuelType,
  SortField,
  SortOrder,
  type Transmission,
  type Vehicle,
  type VehicleFilter,
  type VehicleQuery,
  createActor,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import type { ExternalBlob } from "@caffeineai/object-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Re-export the authoritative types from the generated binding so the
// frontend always matches the backend contract exactly. Enums are value
// exports (BodyType.suv = 'suv'), so they must be re-exported as values.
export {
  BodyType,
  Condition,
  Drivetrain,
  FuelType,
  SortField,
  SortOrder,
  Transmission,
} from "@/backend";
export type {
  Vehicle,
  VehicleFilter,
  VehicleQuery,
} from "@/backend";
export type { ExternalBlob } from "@caffeineai/object-storage";

/**
 * Serialization-safe view of a Vehicle. The generated binding exposes
 * `price`, `year`, `mileage`, and `id` as `bigint`, which cannot be stored in
 * the React Query cache (or any JSON-serializing store) without throwing
 * "Do not know how to serialize a BigInt". We convert those fields to strings
 * at the query boundary so the cache and components only ever see plain data.
 */
export interface VehicleView {
  id: string;
  vin: string;
  model: string;
  sellerNotes: string;
  title: string;
  featured: boolean;
  mileage: string;
  drivetrain: Drivetrain;
  make: string;
  color: string;
  year: string;
  sellerContact: string;
  description: string;
  transmission: Transmission;
  fuelType: FuelType;
  price: string;
  bodyType: BodyType;
  location: string;
  photos: ExternalBlob[];
  condition: Condition;
}

export function toVehicleView(vehicle: Vehicle): VehicleView {
  return {
    ...vehicle,
    id: vehicle.id.toString(),
    mileage: vehicle.mileage.toString(),
    year: vehicle.year.toString(),
    price: vehicle.price.toString(),
  };
}

export const emptyFilter: VehicleFilter = {};

export const defaultQuery: VehicleQuery = {
  filter: emptyFilter,
  sortField: SortField.price,
  sortOrder: SortOrder.desc,
};

export function useVehicles() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      if (!actor) return [];
      const vehicles = await actor.listVehicles();
      return vehicles.map(toVehicleView);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVehicle(id: bigint | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["vehicles", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      const vehicle = await actor.getVehicle(id);
      return vehicle ? toVehicleView(vehicle) : null;
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

// React Query hashes query keys with JSON.stringify, which throws on bigint.
// The filter carries bigint fields (year, minPrice, maxPrice), so build a
// serializable key from stringified values to keep the cache safe.
function toSerializableFilter(filter: VehicleFilter): Record<string, unknown> {
  return {
    make: filter.make,
    year: filter.year?.toString(),
    maxPrice: filter.maxPrice?.toString(),
    minPrice: filter.minPrice?.toString(),
    fuelType: filter.fuelType,
    bodyType: filter.bodyType,
    condition: filter.condition,
  };
}

export function useSearchVehicles(query: VehicleQuery) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: [
      "vehicles",
      "search",
      query.sortField,
      query.sortOrder,
      toSerializableFilter(query.filter),
    ],
    queryFn: async () => {
      if (!actor) return [];
      const vehicles = await actor.searchVehicles(query);
      return vehicles.map(toVehicleView);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVehicle() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createVehicle(vehicle);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
