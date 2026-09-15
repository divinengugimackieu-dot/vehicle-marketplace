import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { ExternalBlob } from "@caffeineai/object-storage";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { PhotoUpload } from "@/components/PhotoUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BodyType,
  Condition,
  Drivetrain,
  FuelType,
  Transmission,
  type Vehicle,
  useCreateVehicle,
} from "@/lib/api";
import {
  bodyTypeLabel,
  conditionLabel,
  drivetrainLabel,
  fuelLabel,
  transmissionLabel,
} from "@/lib/format";

const bodyTypes: BodyType[] = [
  BodyType.sedan,
  BodyType.suv,
  BodyType.hatchback,
  BodyType.coupe,
  BodyType.convertible,
  BodyType.pickup,
  BodyType.van,
  BodyType.wagon,
];

const fuelTypes: FuelType[] = [
  FuelType.petrol,
  FuelType.diesel,
  FuelType.electric,
  FuelType.hybrid,
  FuelType.plugInHybrid,
];

const transmissions: Transmission[] = [
  Transmission.manual,
  Transmission.automatic,
  Transmission.semiAutomatic,
];

const drivetrains: Drivetrain[] = [
  Drivetrain.fwd,
  Drivetrain.rwd,
  Drivetrain.awd,
  Drivetrain.fourWd,
];

const conditions: Condition[] = [
  Condition.new_,
  Condition.used,
  Condition.certifiedPreOwned,
];

interface FormErrors {
  title?: string;
  make?: string;
  model?: string;
  year?: string;
  price?: string;
  mileage?: string;
}

export function Sell() {
  const navigate = useNavigate();
  const createVehicle = useCreateVehicle();
  const { login, isAuthenticated, isInitializing, isLoggingIn } =
    useInternetIdentity();

  const [title, setTitle] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");
  const [vin, setVin] = useState("");
  const [location, setLocation] = useState("");
  const [sellerContact, setSellerContact] = useState("");
  const [description, setDescription] = useState("");
  const [sellerNotes, setSellerNotes] = useState("");
  const [bodyType, setBodyType] = useState<BodyType>(BodyType.sedan);
  const [fuelType, setFuelType] = useState<FuelType>(FuelType.petrol);
  const [transmission, setTransmission] = useState<Transmission>(
    Transmission.automatic,
  );
  const [drivetrain, setDrivetrain] = useState<Drivetrain>(Drivetrain.awd);
  const [condition, setCondition] = useState<Condition>(Condition.used);
  const [photos, setPhotos] = useState<ExternalBlob[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Listing title is required.";
    if (!make.trim()) next.make = "Make is required.";
    if (!model.trim()) next.model = "Model is required.";
    if (!year) {
      next.year = "Year is required.";
    } else {
      const y = Number(year);
      const currentYear = new Date().getFullYear();
      if (Number.isNaN(y) || y < 1886 || y > currentYear + 1) {
        next.year = "Enter a valid year.";
      }
    }
    if (!price) {
      next.price = "Price is required.";
    } else if (Number(price) <= 0) {
      next.price = "Price must be greater than zero.";
    }
    if (!mileage) {
      next.mileage = "Mileage is required.";
    } else if (Number(mileage) < 0) {
      next.mileage = "Mileage cannot be negative.";
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setError(null);
    setUploadProgress(0);

    const vehicle: Vehicle = {
      id: 0n,
      title: title.trim(),
      price: BigInt(Math.round(Number(price))),
      make: make.trim(),
      model: model.trim(),
      year: BigInt(Number(year)),
      mileage: BigInt(Math.round(Number(mileage))),
      fuelType,
      transmission,
      drivetrain,
      color,
      vin,
      condition,
      bodyType,
      description,
      sellerNotes,
      location,
      sellerContact,
      photos,
      featured: false,
    };

    createVehicle.mutate(vehicle, {
      onSuccess: () => {
        void navigate({ to: "/marketplace", search: {} });
      },
      onError: (err) => {
        setError(
          err instanceof Error ? err.message : "Failed to create listing.",
        );
      },
    });
  };

  return (
    <div className="container py-12 md:py-16">
      <Button asChild variant="ghost" className="mb-6 -ml-2">
        <Link to="/marketplace" search={{}}>
          <ArrowLeft className="size-4" />
          Back to marketplace
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Sell your vehicle
        </h1>
        <p className="mt-2 text-muted-foreground">
          List your vehicle on Motorvault and reach thousands of buyers.
        </p>
      </div>

      {!isAuthenticated ? (
        <div
          className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-subtle"
          data-ocid="sell.sign_in_gate"
        >
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-7" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">
            Sign in to list your vehicle
          </h2>
          <p className="mt-3 text-muted-foreground">
            Creating a listing requires a signed-in account so buyers can trust
            every seller on Motorvault. Sign in with Internet Identity to get
            started.
          </p>
          <Button
            type="button"
            size="lg"
            className="mt-6 w-full sm:w-auto"
            onClick={() => login()}
            disabled={isInitializing || isLoggingIn}
            data-ocid="sell.sign_in_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Opening sign-in…
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            {isInitializing
              ? "Checking your session…"
              : "Your identity stays private and is only used to verify you as a seller."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl">
                  Vehicle details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="title">Listing title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 2021 BMW M4 Competition"
                    className="mt-1.5"
                    aria-invalid={!!errors.title}
                    data-ocid="sell.title_input"
                  />
                  {errors.title && (
                    <p
                      className="mt-1.5 text-sm text-destructive"
                      data-ocid="sell.title_error"
                    >
                      {errors.title}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="BMW"
                    className="mt-1.5"
                    aria-invalid={!!errors.make}
                    data-ocid="sell.make_input"
                  />
                  {errors.make && (
                    <p
                      className="mt-1.5 text-sm text-destructive"
                      data-ocid="sell.make_error"
                    >
                      {errors.make}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="M4 Competition"
                    className="mt-1.5"
                    aria-invalid={!!errors.model}
                    data-ocid="sell.model_input"
                  />
                  {errors.model && (
                    <p
                      className="mt-1.5 text-sm text-destructive"
                      data-ocid="sell.model_error"
                    >
                      {errors.model}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2021"
                    className="mt-1.5"
                    aria-invalid={!!errors.year}
                    data-ocid="sell.year_input"
                  />
                  {errors.year && (
                    <p
                      className="mt-1.5 text-sm text-destructive"
                      data-ocid="sell.year_error"
                    >
                      {errors.year}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="65000"
                    className="mt-1.5"
                    aria-invalid={!!errors.price}
                    data-ocid="sell.price_input"
                  />
                  {errors.price && (
                    <p
                      className="mt-1.5 text-sm text-destructive"
                      data-ocid="sell.price_error"
                    >
                      {errors.price}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="24500"
                    className="mt-1.5"
                    aria-invalid={!!errors.mileage}
                    data-ocid="sell.mileage_input"
                  />
                  {errors.mileage && (
                    <p
                      className="mt-1.5 text-sm text-destructive"
                      data-ocid="sell.mileage_error"
                    >
                      {errors.mileage}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Black"
                    className="mt-1.5"
                    data-ocid="sell.color_input"
                  />
                </div>
                <div>
                  <Label htmlFor="vin">VIN</Label>
                  <Input
                    id="vin"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    placeholder="WBA8E9C50GK123456"
                    className="mt-1.5 font-mono"
                    data-ocid="sell.vin_input"
                  />
                </div>
                <div>
                  <Label>Body type</Label>
                  <Select
                    value={bodyType}
                    onValueChange={(v) => setBodyType(v as BodyType)}
                  >
                    <SelectTrigger
                      className="mt-1.5 w-full"
                      data-ocid="sell.body_type_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyTypes.map((bt) => (
                        <SelectItem key={bt} value={bt}>
                          {bodyTypeLabel(bt)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fuel type</Label>
                  <Select
                    value={fuelType}
                    onValueChange={(v) => setFuelType(v as FuelType)}
                  >
                    <SelectTrigger
                      className="mt-1.5 w-full"
                      data-ocid="sell.fuel_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((ft) => (
                        <SelectItem key={ft} value={ft}>
                          {fuelLabel(ft)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Transmission</Label>
                  <Select
                    value={transmission}
                    onValueChange={(v) => setTransmission(v as Transmission)}
                  >
                    <SelectTrigger
                      className="mt-1.5 w-full"
                      data-ocid="sell.transmission_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {transmissionLabel(t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Drivetrain</Label>
                  <Select
                    value={drivetrain}
                    onValueChange={(v) => setDrivetrain(v as Drivetrain)}
                  >
                    <SelectTrigger
                      className="mt-1.5 w-full"
                      data-ocid="sell.drivetrain_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {drivetrains.map((d) => (
                        <SelectItem key={d} value={d}>
                          {drivetrainLabel(d)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select
                    value={condition}
                    onValueChange={(v) => setCondition(v as Condition)}
                  >
                    <SelectTrigger
                      className="mt-1.5 w-full"
                      data-ocid="sell.condition_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {conditionLabel(c)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the vehicle's condition, features, and history…"
                    className="mt-1.5"
                    data-ocid="sell.description_input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="sellerNotes">Seller notes</Label>
                  <Textarea
                    id="sellerNotes"
                    value={sellerNotes}
                    onChange={(e) => setSellerNotes(e.target.value)}
                    placeholder="Any additional notes for potential buyers…"
                    className="mt-1.5"
                    data-ocid="sell.seller_notes_input"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl">Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <PhotoUpload
                  photos={photos}
                  onChange={setPhotos}
                  onProgress={setUploadProgress}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl">
                  Contact & location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Austin, TX"
                    className="mt-1.5"
                    data-ocid="sell.location_input"
                  />
                </div>
                <div>
                  <Label htmlFor="sellerContact">Contact info</Label>
                  <Input
                    id="sellerContact"
                    value={sellerContact}
                    onChange={(e) => setSellerContact(e.target.value)}
                    placeholder="(512) 555-0142"
                    className="mt-1.5"
                    data-ocid="sell.contact_input"
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <div
                className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                data-ocid="sell.error_state"
              >
                {error}
              </div>
            )}

            {createVehicle.isPending && (
              <div
                className="rounded-lg border border-border bg-card p-4"
                data-ocid="sell.upload_progress"
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {uploadProgress < 100
                      ? "Uploading photos…"
                      : "Publishing listing…"}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {uploadProgress}%
                  </span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-lg"
              disabled={createVehicle.isPending}
              data-ocid="sell.submit_button"
            >
              {createVehicle.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                "Publish listing"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By publishing, you agree to our listing guidelines.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
