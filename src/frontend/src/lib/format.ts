import type {
  BodyType,
  Condition,
  Drivetrain,
  FuelType,
  Transmission,
} from "./api";

export function formatPrice(value: bigint | string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatMileage(value: bigint | string): string {
  return `${new Intl.NumberFormat("en-US").format(Number(value))} mi`;
}

export function formatYear(value: bigint | string): string {
  return String(value);
}

export function formatVin(value: string): string {
  return value.toUpperCase();
}

export function fuelLabel(fuel: FuelType): string {
  switch (fuel) {
    case "petrol":
      return "Petrol";
    case "diesel":
      return "Diesel";
    case "electric":
      return "Electric";
    case "hybrid":
      return "Hybrid";
    case "plugInHybrid":
      return "Plug-in Hybrid";
    default:
      return fuel;
  }
}

export function transmissionLabel(transmission: Transmission): string {
  switch (transmission) {
    case "manual":
      return "Manual";
    case "automatic":
      return "Automatic";
    case "semiAutomatic":
      return "Semi-Automatic";
    default:
      return transmission;
  }
}

export function drivetrainLabel(drivetrain: Drivetrain): string {
  switch (drivetrain) {
    case "fwd":
      return "FWD";
    case "rwd":
      return "RWD";
    case "awd":
      return "AWD";
    case "fourWd":
      return "4WD";
    default:
      return drivetrain;
  }
}

export function conditionLabel(condition: Condition): string {
  switch (condition) {
    case "new":
      return "New";
    case "used":
      return "Used";
    case "certifiedPreOwned":
      return "Certified Pre-Owned";
    default:
      return condition;
  }
}

export function bodyTypeLabel(bodyType: BodyType): string {
  switch (bodyType) {
    case "sedan":
      return "Sedan";
    case "suv":
      return "SUV";
    case "hatchback":
      return "Hatchback";
    case "coupe":
      return "Coupe";
    case "convertible":
      return "Convertible";
    case "pickup":
      return "Pickup";
    case "van":
      return "Van";
    case "wagon":
      return "Wagon";
    default:
      return bodyType;
  }
}
