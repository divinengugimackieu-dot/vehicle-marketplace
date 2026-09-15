import Map "mo:core/Map";
import Order "mo:core/Order";
import Types "../types/vehicles";

module {
  public func listVehicles(vehicles : Map.Map<Types.VehicleId, Types.Vehicle>) : [Types.Vehicle] {
    vehicles.values().toArray()
  };

  public func getVehicle(vehicles : Map.Map<Types.VehicleId, Types.Vehicle>, id : Types.VehicleId) : ?Types.Vehicle {
    vehicles.get(id)
  };

  public func createVehicle(vehicles : Map.Map<Types.VehicleId, Types.Vehicle>, state : { var nextId : Types.VehicleId }, vehicle : Types.Vehicle) : Types.VehicleId {
    let id = state.nextId;
    state.nextId += 1;
    vehicles.add(id, { vehicle with id = id });
    id
  };

  public func searchVehicles(vehicles : Map.Map<Types.VehicleId, Types.Vehicle>, searchQuery : Types.VehicleQuery) : [Types.Vehicle] {
    let all = vehicles.values().toArray();
    let filtered = all.filter(func v = matches(v, searchQuery.filter));
    filtered.sort(func (a, b) = compareVehicles(a, b, searchQuery.sortField, searchQuery.sortOrder))
  };

  func matches(v : Types.Vehicle, f : Types.VehicleFilter) : Bool {
    let keywordOk = switch (f.make) {
      case (?m) {
        let term = m.toLower();
        v.make.toLower().contains(#text term)
          or v.model.toLower().contains(#text term)
          or v.title.toLower().contains(#text term)
      };
      case null true;
    };
    let bodyOk = switch (f.bodyType) { case (?b) v.bodyType == b; case null true };
    let minPriceOk = switch (f.minPrice) { case (?p) v.price >= p; case null true };
    let maxPriceOk = switch (f.maxPrice) { case (?p) v.price <= p; case null true };
    let yearOk = switch (f.year) { case (?y) v.year == y; case null true };
    let fuelOk = switch (f.fuelType) { case (?ft) v.fuelType == ft; case null true };
    let condOk = switch (f.condition) { case (?c) v.condition == c; case null true };
    keywordOk and bodyOk and minPriceOk and maxPriceOk and yearOk and fuelOk and condOk
  };

  func compareVehicles(a : Types.Vehicle, b : Types.Vehicle, field : Types.SortField, order : Types.SortOrder) : Order.Order {
    let base = switch (field) {
      case (#price) { compareNat(a.price, b.price) };
      case (#year) { compareNat(a.year, b.year) };
      case (#mileage) { compareNat(a.mileage, b.mileage) };
    };
    switch (order) {
      case (#asc) { base };
      case (#desc) {
        switch (base) {
          case (#less) { #greater };
          case (#greater) { #less };
          case (#equal) { #equal };
        };
      };
    };
  };

  func compareNat(a : Nat, b : Nat) : Order.Order {
    if (a < b) { #less } else if (a > b) { #greater } else { #equal }
  };
};
