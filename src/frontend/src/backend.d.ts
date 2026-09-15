import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
import type { ExternalBlob } from "@caffeineai/object-storage";
export type { ExternalBlob } from "@caffeineai/object-storage";
export type VehicleId = bigint;
export interface VehicleFilter {
    make?: string;
    year?: bigint;
    maxPrice?: bigint;
    fuelType?: FuelType;
    minPrice?: bigint;
    bodyType?: BodyType;
    condition?: Condition;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Vehicle {
    id: VehicleId;
    vin: string;
    model: string;
    sellerNotes: string;
    title: string;
    featured: boolean;
    mileage: bigint;
    drivetrain: Drivetrain;
    make: string;
    color: string;
    year: bigint;
    sellerContact: string;
    description: string;
    transmission: Transmission;
    fuelType: FuelType;
    price: bigint;
    bodyType: BodyType;
    location: string;
    photos: Array<ExternalBlob>;
    condition: Condition;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface VehicleQuery {
    sortField: SortField;
    sortOrder: SortOrder;
    filter: VehicleFilter;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum BodyType {
    suv = "suv",
    van = "van",
    convertible = "convertible",
    coupe = "coupe",
    sedan = "sedan",
    pickup = "pickup",
    wagon = "wagon",
    hatchback = "hatchback"
}
export enum Condition {
    new_ = "new",
    certifiedPreOwned = "certifiedPreOwned",
    used = "used"
}
export enum Drivetrain {
    awd = "awd",
    fwd = "fwd",
    rwd = "rwd",
    fourWd = "fourWd"
}
export enum FuelType {
    petrol = "petrol",
    hybrid = "hybrid",
    diesel = "diesel",
    plugInHybrid = "plugInHybrid",
    electric = "electric"
}
export enum SortField {
    mileage = "mileage",
    year = "year",
    price = "price"
}
export enum SortOrder {
    asc = "asc",
    desc = "desc"
}
export enum Transmission {
    automatic = "automatic",
    manual = "manual",
    semiAutomatic = "semiAutomatic"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createVehicle(vehicle: Vehicle): Promise<VehicleId>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getVehicle(id: VehicleId): Promise<Vehicle | null>;
    isCallerAdmin(): Promise<boolean>;
    listVehicles(): Promise<Array<Vehicle>>;
    schema(): Promise<string>;
    searchVehicles(searchQuery: VehicleQuery): Promise<Array<Vehicle>>;
}
