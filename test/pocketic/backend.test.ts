import { PocketIc, createIdentity } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;
let canisterId: Awaited<ReturnType<PocketIc["setupCanister"]>>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  const fixture = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  });
  actor = fixture.actor;
  canisterId = fixture.canisterId;
});

afterAll(async () => {
  await pic?.tearDown();
});

it("preloads the sample vehicle listings on first load", async () => {
  const vehicles = await actor.listVehicles();
  expect(vehicles.length).toBeGreaterThanOrEqual(8);
  expect(vehicles[0]).toMatchObject({ make: "Tesla", title: "2022 Tesla Model 3 Long Range" });
});

it("returns a single vehicle by id", async () => {
  const vehicle = await actor.getVehicle(2n);
  expect(vehicle).not.toEqual([]);
  expect(vehicle[0]).toMatchObject({ id: 2n, make: "Toyota", model: "RAV4" });
});

it("returns [] for an unknown vehicle id", async () => {
  expect(await actor.getVehicle(9999n)).toEqual([]);
});

it("filters and sorts vehicles through searchVehicles", async () => {
  const results = await actor.searchVehicles({
    sortField: { price: null },
    sortOrder: { asc: null },
    filter: { make: [], year: [], maxPrice: [], fuelType: [], minPrice: [], bodyType: [], condition: [] },
  });
  expect(results.length).toBeGreaterThan(0);
  // Ascending price: first result is the cheapest.
  const prices = results.map((v) => v.price);
  expect([...prices].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))).toEqual(prices);
});

it("filters by body type through searchVehicles", async () => {
  const results = await actor.searchVehicles({
    sortField: { price: null },
    sortOrder: { desc: null },
    filter: {
      make: [],
      year: [],
      maxPrice: [],
      fuelType: [],
      minPrice: [],
      bodyType: [{ suv: null }],
      condition: [],
    },
  });
  expect(results.length).toBeGreaterThan(0);
  for (const v of results) {
    expect(v.bodyType).toEqual({ suv: null });
  }
});

it("round-trips a vehicle through createVehicle then listVehicles", async () => {
  // createVehicle requires the caller to hold the `user` permission. The first
  // non-anonymous caller to initialize access control becomes admin (which
  // implies user), so sign in as a real principal before initializing.
  // `createIdentity` comes from @dfinity/pic (resolvable from the lane) and
  // yields a deterministic non-anonymous principal via `getPrincipal()`.
  const seller = createIdentity("seller-seed").getPrincipal();
  actor.setPrincipal(seller);
  await actor._initialize_access_control();

  const id = await actor.createVehicle({
    id: 0n,
    title: "2023 Test Roadster",
    price: 55000n,
    make: "TestMake",
    model: "Roadster",
    year: 2023n,
    mileage: 5000n,
    fuelType: { electric: null },
    transmission: { automatic: null },
    drivetrain: { awd: null },
    color: "Red",
    vin: "TESTVIN123456789",
    condition: { new: null },
    bodyType: { coupe: null },
    description: "A test listing",
    sellerNotes: "",
    location: "Testville",
    sellerContact: "test@example.com",
    photos: [],
    featured: false,
  });

  const vehicles = await actor.listVehicles();
  expect(vehicles).toContainEqual(
    expect.objectContaining({ id, make: "TestMake", title: "2023 Test Roadster" }),
  );
});

it("rejects an anonymous caller from creating a listing", async () => {
  // A fresh actor on the same canister defaults to the anonymous sender (the
  // shared `actor` above has its principal set to the seller). Anonymous holds
  // no `user` permission, so createVehicle traps.
  const anonymousActor = pic!.createActor<_SERVICE>(idlFactory, canisterId);
  await expect(
    anonymousActor.createVehicle({
      id: 0n,
      title: "2023 Anonymous Attempt",
      price: 10000n,
      make: "TestMake",
      model: "Sedan",
      year: 2023n,
      mileage: 1000n,
      fuelType: { petrol: null },
      transmission: { automatic: null },
      drivetrain: { fwd: null },
      color: "Black",
      vin: "ANONVIN000000001",
      condition: { used: null },
      bodyType: { sedan: null },
      description: "Should be rejected",
      sellerNotes: "",
      location: "Nowhere",
      sellerContact: "anon@example.com",
      photos: [],
      featured: false,
    }),
  ).rejects.toThrow(/Unauthorized/);
});
