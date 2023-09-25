/**
 * This file was auto generated. Do not modify its content.
 *
 * @file Car
 */
import Vehicle from "./Vehicle.js";

class Car extends Vehicle {
    constructor(id, licensePlate) {
        super(id);
        this.licensePlate = licensePlate;
        this.vehicleType = "CAR";
    }
}

export default Car;
