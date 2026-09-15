mixin () {
  public query func getApiDoc() : async Text {
    "## Vehicle Marketplace Backend API

This canister powers an online vehicle marketplace. It stores vehicle listings
and exposes them through a public read API, a signed-in create endpoint, an
OQL query layer, and an Internet Identity based authorization system.

### Public methods

#### Vehicle listing endpoints

- `listVehicles() : async [Vehicle]` — query. Returns every vehicle listing.
  No authentication required; anonymous callers may read the full catalogue.
- `getVehicle(id : Nat) : async ?Vehicle` — query. Returns the vehicle with the
  given `id`, or `null` when no such vehicle exists. No authentication required.
- `searchVehicles(searchQuery : VehicleQuery) : async [Vehicle]` — query.
  Filters and sorts the catalogue. `VehicleQuery` carries a `filter`
  (`make`, `bodyType`, `minPrice`, `maxPrice`, `year`, `fuelType`, `condition`
  — each optional), a `sortField` (`#price`, `#year`, `#mileage`) and a
  `sortOrder` (`#asc`, `#desc`). No authentication required.
- `createVehicle(vehicle : Vehicle) : async Nat` — update. Adds a new listing
  and returns its assigned `id`. **Requires a signed-in caller with at least
  the `#user` role.** Anonymous or unregistered callers are rejected with the
  trap message `Unauthorized: Only signed-in users can create listings`. The
  caller-supplied `id` is ignored; the backend assigns the next sequential id.

#### Authorization endpoints (from the authorization mixin)

- `_initialize_access_control() : async ()` — update. Registers the caller as
  the first user. The first signed-in caller to register becomes `#admin`;
  subsequent callers become `#user`. Call this once as a signed-in caller
  before any role-guarded call (guarded queries included).
- `_internet_identity_sign_in_start() : async Principal` and
  `_internet_identity_sign_in_finish(...)` — update. Internet Identity sign-in
  flow used by the frontend.
- `assignCallerUserRole(user : Principal, role : UserRole) : async ()` —
  update. Admin-only; assigns a role to another principal.
- `getCallerUserRole() : async UserRole` — query. Returns the caller's role.
- `isCallerAdmin() : async Bool` — query. Returns whether the caller is admin.

#### OQL query layer

- `schema() : async Text` — query. Returns the JSON schema of the queryable
  `vehicle` entity.
- `execute(query : Text) : async Text` — query. Executes a JSON OQL query
  against the `vehicle` entity.

#### Object storage endpoints

The object-storage mixin exposes endpoints for uploading and retrieving photo
blobs referenced by vehicle listings. See the object-storage extension for the
exact method set.

### Authentication and authorization

- **Anonymous** callers are treated as guests. They may read the catalogue
  (`listVehicles`, `getVehicle`, `searchVehicles`, `schema`, `execute`) but
  cannot create listings.
- **Signed-in** callers with the `#user` role (or higher) may create listings.
- **Admin** callers may assign roles.
- The `vehicle` OQL entity is `#public_`: anyone, including anonymous callers,
  may read all rows through `schema()` / `execute()`.

**Registration prerequisite:** a caller is only registered when they sign in
through the app's own frontend, which triggers registration. A principal that
never signed in through the frontend is unregistered even if it belongs to the
app's owner. A signed-in caller derived against a different origin is a
different principal than the one the frontend registered. Unregistered or
anonymous callers receive the trap message
`Unauthorized: Only signed-in users can create listings` on `createVehicle`.

**Identity derivation:** the app's frontend pins an Internet Identity
derivation origin, published at `/.well-known/ii-derivation-origin` when
available. An agent already holding the user's Internet Identity authorization
derives the correct per-app principal against that origin, for example
`icp identity link web <name> --app <host>`. Such a delegation acts with the
user's full authority in this app until it expires.

### Units and encodings

- `id` — `Nat`, sequential, assigned by the backend.
- `price`, `year`, `mileage` — `Nat`. `price` is in whole currency units
  (dollars); `mileage` is in miles; `year` is the model year.
- `fuelType` — variant: `#petrol`, `#diesel`, `#electric`, `#hybrid`,
  `#plugInHybrid`.
- `transmission` — variant: `#manual`, `#automatic`, `#semiAutomatic`.
- `drivetrain` — variant: `#fwd`, `#rwd`, `#awd`, `#fourWd`.
- `condition` — variant: `#new`, `#used`, `#certifiedPreOwned`.
- `bodyType` — variant: `#sedan`, `#suv`, `#hatchback`, `#coupe`,
  `#convertible`, `#pickup`, `#van`, `#wagon`.
- `photos` — `[ExternalBlob]`, off-chain object-storage references. The bytes
  are uploaded/downloaded through the object-storage endpoints, not stored
  inline.
- `featured` — `Bool`, whether the listing is featured.
- In the OQL schema, variant fields are exposed as their tag text (e.g.
  `#electric` becomes `\"electric\"`), and `photos` is exposed as a `photoCount`
  `Nat` column.

### Lifecycle and polling

Listings are created once via `createVehicle` and are immutable thereafter —
there is no update or delete endpoint. `id` values are assigned sequentially
and never reused. There is no long-running operation to poll; reads return
current state immediately.

### Mutation retry safety

`createVehicle` is not idempotent: each successful call appends a new listing
and consumes a new `id`. Replaying a create (e.g. a retried request) produces a
duplicate listing with a new id. There are no destructive endpoints.

### Errors, traps, and gotchas

- `createVehicle` traps with
  `Unauthorized: Only signed-in users can create listings` when the caller is
  anonymous or lacks the `#user` role. A trap rolls back the whole message.
- `getVehicle` returns `null` (not an error) for a missing id.
- The caller-supplied `id` on `createVehicle` is ignored; the backend assigns
  the id.
- `searchVehicles` with an empty filter returns the full catalogue sorted by
  the requested field.
"
  };
};
