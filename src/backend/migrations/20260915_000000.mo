import Map "mo:core/Map";
import Text "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  type FuelType = { #petrol; #diesel; #electric; #hybrid; #plugInHybrid };
  type Transmission = { #manual; #automatic; #semiAutomatic };
  type Drivetrain = { #fwd; #rwd; #awd; #fourWd };
  type Condition = { #new; #used; #certifiedPreOwned };
  type BodyType = { #sedan; #suv; #hatchback; #coupe; #convertible; #pickup; #van; #wagon };

  type Vehicle = {
    id : Nat;
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

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    vehicles : Map.Map<Nat, Vehicle>;
    state : { var nextId : Nat };
  };

  // Builds an object-storage ExternalBlob reference from a blob hash. The
  // frontend decodes the stored bytes as "!caf!" + <hash> and resolves the
  // hash to a direct gateway URL for the photo.
  func photo(hash : Text) : Storage.ExternalBlob {
    ("!caf!" # hash).encodeUtf8()
  };

  func vehicle(
    id : Nat,
    title : Text,
    price : Nat,
    make : Text,
    model : Text,
    year : Nat,
    mileage : Nat,
    fuelType : FuelType,
    transmission : Transmission,
    drivetrain : Drivetrain,
    color : Text,
    vin : Text,
    condition : Condition,
    bodyType : BodyType,
    description : Text,
    sellerNotes : Text,
    location : Text,
    sellerContact : Text,
    photos : [Storage.ExternalBlob],
    featured : Bool,
  ) : Vehicle {
    {
      id;
      title;
      price;
      make;
      model;
      year;
      mileage;
      fuelType;
      transmission;
      drivetrain;
      color;
      vin;
      condition;
      bodyType;
      description;
      sellerNotes;
      location;
      sellerContact;
      photos;
      featured;
    };
  };

  public func migration(_old : OldActor) : NewActor {
    let vehicles = Map.empty<Nat, Vehicle>();

    vehicles.add(
      1,
      vehicle(
        1,
        "2022 Tesla Model 3 Long Range",
        42900,
        "Tesla",
        "Model 3",
        2022,
        18500,
        #electric,
        #automatic,
        #rwd,
        "Pearl White",
        "5YJ3E1EA7NF123456",
        #used,
        #sedan,
        "Dual motor long range with autopilot. One owner, no accidents, garage kept.",
        "Clean title, full service history at Tesla.",
        "San Francisco, CA",
        "seller@example.com",
        [photo("sha256:3f4a9c1b7e2d5f8a0b6c4d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a")],
        true,
      ),
    );

    vehicles.add(
      2,
      vehicle(
        2,
        "2021 Toyota RAV4 Hybrid XLE",
        34500,
        "Toyota",
        "RAV4",
        2021,
        32000,
        #hybrid,
        #automatic,
        #awd,
        "Magnetic Gray",
        "JTMBFREV5MD123456",
        #certifiedPreOwned,
        #suv,
        "Certified pre-owned hybrid SUV with excellent fuel economy and all-wheel drive.",
        "Toyota certified, remaining factory warranty.",
        "Austin, TX",
        "dealer@example.com",
        [photo("sha256:9b2c7d4e1f8a3b6c5d0e9f2a4b7c8d1e3f5a6b9c0d2e4f7a8b1c3d5e6f9a0b2c")],
        true,
      ),
    );

    vehicles.add(
      3,
      vehicle(
        3,
        "2020 Ford F-150 XLT",
        38200,
        "Ford",
        "F-150",
        2020,
        54000,
        #petrol,
        #automatic,
        #fourWd,
        "Oxford White",
        "1FTFW1E53LFA12345",
        #used,
        #pickup,
        "Crew cab 4x4 with tow package. Well maintained work truck.",
        "New tires, recent oil change.",
        "Denver, CO",
        "seller@example.com",
        [photo("sha256:5c8d1e2f3a4b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d")],
        false,
      ),
    );

    vehicles.add(
      4,
      vehicle(
        4,
        "2024 BMW 330i Sedan",
        46800,
        "BMW",
        "330i",
        2024,
        1200,
        #petrol,
        #automatic,
        #rwd,
        "Alpine White",
        "WBA53BG01RCP12345",
        #new,
        #sedan,
        "Brand new 330i with premium package and driver assistance.",
        "Factory warranty, first owner.",
        "Seattle, WA",
        "dealer@example.com",
        [photo("sha256:7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b")],
        true,
      ),
    );

    vehicles.add(
      5,
      vehicle(
        5,
        "2019 Honda Civic Sport",
        22400,
        "Honda",
        "Civic",
        2019,
        41000,
        #petrol,
        #manual,
        #fwd,
        "Sonic Gray",
        "2HGFC2F59KH123456",
        #used,
        #hatchback,
        "Fun-to-drive manual hatchback, great condition, single owner.",
        "Recently serviced, new brakes.",
        "Portland, OR",
        "seller@example.com",
        [photo("sha256:2e4f6a8b0c1d3e5f7a9b0c2d4e6f8a0b1c3d5e7f9a1b2c4d6e8f0a1b3c5d7e9f")],
        false,
      ),
    );

    vehicles.add(
      6,
      vehicle(
        6,
        "2021 Chevrolet Corvette Stingray",
        68000,
        "Chevrolet",
        "Corvette",
        2021,
        9800,
        #petrol,
        #automatic,
        #rwd,
        "Torch Red",
        "1G1YB2D40M5123456",
        #used,
        #coupe,
        "Mid-engine sports car with Z51 package. Garage kept, weekend driver.",
        "No accidents, ceramic coated.",
        "Scottsdale, AZ",
        "seller@example.com",
        [photo("sha256:8c0d2e4f6a8b0c1d3e5f7a9b1c3d5e7f9a0b2c4d6e8f0a1b3c5d7e9f0a2b4c6d8")],
        true,
      ),
    );

    vehicles.add(
      7,
      vehicle(
        7,
        "2020 Mercedes-Benz GLC 300 4MATIC",
        41000,
        "Mercedes-Benz",
        "GLC 300",
        2020,
        36000,
        #diesel,
        #automatic,
        #awd,
        "Obsidian Black",
        "W1N0G8EB4LF123456",
        #certifiedPreOwned,
        #suv,
        "Certified pre-owned luxury SUV with premium interior and driver assistance.",
        "Mercedes certified, extended warranty available.",
        "Chicago, IL",
        "dealer@example.com",
        [photo("sha256:4a6b8c0d2e4f6a8b0c1d3e5f7a9b1c3d5e7f9a0b2c4d6e8f0a1b3c5d7e9f0a2b4")],
        false,
      ),
    );

    vehicles.add(
      8,
      vehicle(
        8,
        "2018 Volkswagen Golf TSI",
        18900,
        "Volkswagen",
        "Golf",
        2018,
        62000,
        #petrol,
        #automatic,
        #fwd,
        "Deep Black Pearl",
        "3VW217AU5JM123456",
        #used,
        #hatchback,
        "Reliable and efficient compact hatchback, great first car.",
        "New battery, clean interior.",
        "Columbus, OH",
        "seller@example.com",
        [photo("sha256:6b8d0f2a4c6e8a0b2d4f6a8c0e2f4a6b8d0f2a4c6e8a0b2d4f6a8c0e2f4a6b8d0f")],
        false,
      ),
    );

    {
      accessControlState = AccessControl.initState();
      vehicles;
      state = { var nextId = 9 };
    };
  };
};
