import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/vehicles";
import VehiclesLib "../lib/vehicles";

mixin (
  accessControlState : AccessControl.AccessControlState,
  vehicles : Map.Map<Types.VehicleId, Types.Vehicle>,
  state : { var nextId : Types.VehicleId },
) {
  public query func listVehicles() : async [Types.Vehicle] {
    VehiclesLib.listVehicles(vehicles)
  };

  public query func getVehicle(id : Types.VehicleId) : async ?Types.Vehicle {
    VehiclesLib.getVehicle(vehicles, id)
  };

  public shared ({ caller }) func createVehicle(vehicle : Types.Vehicle) : async Types.VehicleId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only signed-in users can create listings");
    };
    VehiclesLib.createVehicle(vehicles, state, vehicle)
  };

  public query func searchVehicles(searchQuery : Types.VehicleQuery) : async [Types.Vehicle] {
    VehiclesLib.searchVehicles(vehicles, searchQuery)
  };
};
