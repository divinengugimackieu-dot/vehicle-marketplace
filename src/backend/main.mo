import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import Types "types/vehicles";
import VehiclesApi "mixins/vehicles-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);
  include MixinObjectStorage();

  let vehicles : Map.Map<Types.VehicleId, Types.Vehicle>;
  let state : { var nextId : Types.VehicleId };

  include VehiclesApi(accessControlState, vehicles, state);
  include ApiDocMixin();

  func fuelToText(f : Types.FuelType) : Text {
    switch (f) {
      case (#petrol) "petrol";
      case (#diesel) "diesel";
      case (#electric) "electric";
      case (#hybrid) "hybrid";
      case (#plugInHybrid) "plugInHybrid";
    };
  };

  func transmissionToText(t : Types.Transmission) : Text {
    switch (t) {
      case (#manual) "manual";
      case (#automatic) "automatic";
      case (#semiAutomatic) "semiAutomatic";
    };
  };

  func drivetrainToText(d : Types.Drivetrain) : Text {
    switch (d) {
      case (#fwd) "fwd";
      case (#rwd) "rwd";
      case (#awd) "awd";
      case (#fourWd) "fourWd";
    };
  };

  func conditionToText(c : Types.Condition) : Text {
    switch (c) {
      case (#new) "new";
      case (#used) "used";
      case (#certifiedPreOwned) "certifiedPreOwned";
    };
  };

  func bodyTypeToText(b : Types.BodyType) : Text {
    switch (b) {
      case (#sedan) "sedan";
      case (#suv) "suv";
      case (#hatchback) "hatchback";
      case (#coupe) "coupe";
      case (#convertible) "convertible";
      case (#pickup) "pickup";
      case (#van) "van";
      case (#wagon) "wagon";
    };
  };

  include Expose({
    entities = [
      OQL.Entity.manual<Types.Vehicle>("vehicle", func () = vehicles.values(), "Vehicle", "id")
        .sample({
          id = 0;
          title = "";
          price = 0;
          make = "";
          model = "";
          year = 0;
          mileage = 0;
          fuelType = #petrol;
          transmission = #manual;
          drivetrain = #fwd;
          color = "";
          vin = "";
          condition = #used;
          bodyType = #sedan;
          description = "";
          sellerNotes = "";
          location = "";
          sellerContact = "";
          photos = [];
          featured = false;
        })
        .payload("id", func v = v.id)
        .payload("title", func v = v.title)
        .payload("price", func v = v.price)
        .payload("make", func v = v.make)
        .payload("model", func v = v.model)
        .payload("year", func v = v.year)
        .payload("mileage", func v = v.mileage)
        .payload("fuelType", func v = fuelToText(v.fuelType))
        .payload("transmission", func v = transmissionToText(v.transmission))
        .payload("drivetrain", func v = drivetrainToText(v.drivetrain))
        .payload("color", func v = v.color)
        .payload("vin", func v = v.vin)
        .payload("condition", func v = conditionToText(v.condition))
        .payload("bodyType", func v = bodyTypeToText(v.bodyType))
        .payload("location", func v = v.location)
        .payload("photoCount", func v = v.photos.size())
        .payload("featured", func v = v.featured)
        .public_()
        .build(),
    ];
  });
};
