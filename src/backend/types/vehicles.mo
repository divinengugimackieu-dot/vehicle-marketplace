import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type VehicleId = Nat;

  public type FuelType = {
    #petrol;
    #diesel;
    #electric;
    #hybrid;
    #plugInHybrid;
  };

  public type Transmission = {
    #manual;
    #automatic;
    #semiAutomatic;
  };

  public type Drivetrain = {
    #fwd;
    #rwd;
    #awd;
    #fourWd;
  };

  public type Condition = {
    #new;
    #used;
    #certifiedPreOwned;
  };

  public type BodyType = {
    #sedan;
    #suv;
    #hatchback;
    #coupe;
    #convertible;
    #pickup;
    #van;
    #wagon;
  };

  // Photos are stored via the object-storage extension. Each entry is an
  // off-chain blob reference; the frontend uploads/downloads the bytes.
  public type Vehicle = {
    id : VehicleId;
    title : Text;
    price : Nat;
    make : Text;
    model : Text;
    year : Nat;
    mileage : Nat;
    fuelType : FuelType;
    transmission : Transmission;
    drivetrain : Drivetrain;
    color : Text;
    vin : Text;
    condition : Condition;
    bodyType : BodyType;
    description : Text;
    sellerNotes : Text;
    location : Text;
    sellerContact : Text;
    photos : [Storage.ExternalBlob];
    featured : Bool;
  };

  public type SortField = {
    #price;
    #year;
    #mileage;
  };

  public type SortOrder = {
    #asc;
    #desc;
  };

  public type VehicleFilter = {
    make : ?Text;
    bodyType : ?BodyType;
    minPrice : ?Nat;
    maxPrice : ?Nat;
    year : ?Nat;
    fuelType : ?FuelType;
    condition : ?Condition;
  };

  public type VehicleQuery = {
    filter : VehicleFilter;
    sortField : SortField;
    sortOrder : SortOrder;
  };
};
